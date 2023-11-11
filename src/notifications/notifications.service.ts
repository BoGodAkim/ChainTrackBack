import { Inject, Injectable } from '@nestjs/common';
import { Notification } from '../database/notification/notification.entity';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import 'firebase-admin/messaging';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { chunk } from 'lodash';
import * as shell from 'shelljs';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('FIREBASE') private readonly firebase: firebase.app.App,
  ) {}

  async sendMessages(notifications: Notification[]) {
    const messages = notifications.map((notification) => ({
      token: notification.device.fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    }));
    const response = await this.firebase.messaging().sendEach(messages);
    console.log(response);
    // console.log(response['responses'][0]);
  }
}
