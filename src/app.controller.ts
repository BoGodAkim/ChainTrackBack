import { Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { generateNonce, SiweErrorType, SiweMessage } from 'siwe';
import { Request, Response } from 'express';
import { UserService } from './database/user.service';
import { Monitor, Notification } from '@prisma/client';
import { MonitorService } from './database/monitor.service';

import { JsonRpcProvider, getAddress } from 'ethers';
import { LSP0ERC725AccountInit__factory } from '../libs/contracts/factories/LSP0ERC725AccountInit__factory.js';

const provider = new JsonRpcProvider('https://rpc.testnet.lukso.network');

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
        res.status(422).json({
          message: 'Expected prepareMessage object as body. ',
        });
        return;
      }

      const SIWEObject = new SiweMessage(req.body.message);
      // const { data: message } = await SIWEObject.verify({
      //   signature: req.body.signature,
      //   nonce: req.session.nonce,
      // });

      const account = getAddress(SIWEObject.address);
      const contract = LSP0ERC725AccountInit__factory.connect(
        account,
        provider,
      );
      const value = await contract.isValidSignature(
        req.body.hashedMessage,
        req.body.signature,
      );
      if (value !== '0x1626ba7e') {
        throw new Error('Invalid token');
      }

      req.session.siwe = SIWEObject;
      req.session.cookie.expires = new Date(SIWEObject.expirationTime);
      res.status(200).send(true);
      return;
    } catch (e) {
      req.session.siwe = null;
      req.session.nonce = null;
      console.log(e);
      console.log(e.message);
      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          res.status(440).json({ error: e.message ?? e });
          break;
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          res.status(422).json({ error: e.message ?? e });
          break;
        }
        default: {
          res.status(500).json({ error: e.message ?? e });
          break;
        }
      }
      return;
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
