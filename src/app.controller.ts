import { Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { generateNonce, SiweErrorType, SiweMessage } from 'siwe';
import { Request, Response } from 'express';
import { UserService } from './database/user.service';
import { Monitor, Notification } from '@prisma/client';
import { MonitorService } from './database/monitor.service';

declare module 'express-session' {
  export interface SessionData {
    nonce: string;
    siwe: SiweMessage;
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly monitorService: MonitorService,
  ) {}

  @Get('/nonce')
  getNonce(@Req() req: Request): string {
    req.session.nonce = generateNonce();
    return req.session.nonce;
  }

  @Post('/verify')
  async verify(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.body.message) {
        return res.status(422).json({
          message:
            'Expected prepareMessage object as body. ' +
            JSON.stringify(req.headers, null, 2) +
            ' ' +
            JSON.stringify(req.body, null, 2),
        });
        //(
        //   'Expected prepareMessage object as body. ' +
        //   JSON.stringify(req.headers, null, 2) +
        //   ' ' +
        //   JSON.stringify(req.body, null, 2)
        // );
      }

      const SIWEObject = new SiweMessage(req.body.message);
      const { data: message } = await SIWEObject.verify({
        signature: req.body.signature,
        nonce: req.session.nonce,
      });

      req.session.siwe = message;
      req.session.cookie.expires = new Date(message.expirationTime);
      return req.session.save(() => res.status(200).send(true));
    } catch (e) {
      req.session.siwe = null;
      req.session.nonce = null;
      console.log(e);
      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          return req.session.save(() => res.status(440).json(e));
          break;
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          return req.session.save(() => res.status(422).json(e));
          break;
        }
        default: {
          return res.status(500).json(e);
          // return req.session.save(() =>
          //   res.status(500).json({ message: e.message }),
          // );
          break;
        }
      }
    }
  }

  @Post('/follow/:followedId')
  async follow(
    @Req() req: Request,
    @Param('followedId') followedId: string,
  ): Promise<void> {
    if (!req.session.siwe) return;
    await this.userService.addFollow({
      follower: { id: req.session.siwe.address },
      followed: { id: followedId },
    });
  }

  @Post('/unfollow/:followedId')
  async unfollow(
    @Req() req: Request,
    @Param('followedId') followedId: string,
  ): Promise<void> {
    if (!req.session.siwe) return;
    await this.userService.removeFollow({
      follower: { id: req.session.siwe.address },
      followed: { id: followedId },
    });
  }

  @Get('/getNotifications')
  async getNotifications(@Req() req: Request): Promise<Notification[]> {
    if (!req.session.siwe) return;
    return await this.userService.notifications({
      id: req.session.siwe.address,
    });
  }

  @Get('/getMonitors')
  async getMonitors(@Req() req: Request): Promise<Monitor[]> {
    if (!req.session.siwe) return;
    return await this.userService.trackedMonitors({
      id: req.session.siwe.address,
    });
  }

  @Post('/trackMonitor/:monitorId')
  async trackMonitor(
    @Req() req: Request,
    @Param('monitorId') monitorId: string,
  ): Promise<void> {
    if (!req.session.siwe) return;
    await this.userService.trackMonitor({
      user: { id: req.session.siwe.address },
      monitor: { id: monitorId },
    });
  }

  @Post('/untrackMonitor/:monitorId')
  async untrackMonitor(
    @Req() req: Request,
    @Param('monitorId') monitorId: string,
  ): Promise<void> {
    if (!req.session.siwe) return;
    await this.userService.untrackMonitor({
      user: { id: req.session.siwe.address },
      monitor: { id: monitorId },
    });
  }

  @Post('/createMonitor')
  async createMonitor(@Req() req: Request): Promise<void> {
    if (!req.session.siwe) return;
    if (req.body.monitor.ownerId != req.session.siwe.address) return;
    await this.monitorService.createMonitor(req.body.monitor);
  }

  @Post('/updateMonitor/:monitorId')
  async updateMonitor(
    @Req() req: Request,
    @Param('monitorId') monitorId: string,
  ): Promise<void> {
    if (!req.session.siwe) return;
    if (req.body.monitor.ownerId != req.session.siwe.address) return;
    await this.monitorService.updateMonitor({
      where: { id: monitorId },
      data: req.body.monitor,
    });
  }

  @Delete('/deleteMonitor/:monitorId')
  async deleteMonitor(
    @Req() req: Request,
    @Param('monitorId') monitorId: string,
  ): Promise<void> {
    if (!req.session.siwe) return;
    const monitor = await this.monitorService.monitor({ id: monitorId });
    if (!monitor) return;
    if (monitor.ownerId != req.session.siwe.address) return;
    await this.monitorService.deleteMonitor({ id: req.body.monitor.id });
  }

  @Get('/getPopularUsers')
  async getPopularUsers(): Promise<any> {
    return await this.userService.users({
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
    });
  }
}
