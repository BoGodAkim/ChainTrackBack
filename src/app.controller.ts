import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { generateNonce, SiweErrorType, SiweMessage } from 'siwe';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/nonce')
  getNonce(@Req() req: Request): string {
    req.session.nonce = generateNonce();
    return req.session.nonce;
  }

  @Post('/verify')
  async verify(@Req() req: Request, @Res() res: Response): Promise<boolean> {
    try {
      if (!req.body.message) {
        res
          .status(422)
          .json({ message: 'Expected prepareMessage object as body.' });
        return;
      }

      const SIWEObject = new SiweMessage(req.body.message);
      const { data: message } = await SIWEObject.verify({
        signature: req.body.signature,
        nonce: req.session.nonce,
      });

      req.session.siwe = message;
      req.session.cookie.expires = new Date(message.expirationTime);
      req.session.save(() => res.status(200).send(true));
    } catch (e) {
      req.session.siwe = null;
      req.session.nonce = null;
      console.error(e);
      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          req.session.save(() => res.status(440).json({ message: e.message }));
          break;
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          req.session.save(() => res.status(422).json({ message: e.message }));
          break;
        }
        default: {
          req.session.save(() => res.status(500).json({ message: e.message }));
          break;
        }
      }
    }
  }
}
