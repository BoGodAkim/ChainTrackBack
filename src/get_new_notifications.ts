import luksoscan from './luksoscan';
import { Transaction } from './luksoscan';
import { UserService } from './database/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma, Monitor } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class NotificationUpdater {
  constructor(private readonly userService: UserService) {}

  async getLastMatchingTransaction(
    monitor: Monitor,
  ): Promise<Transaction | null> {
    const transactions = await luksoscan.getTransactions(
      monitor.Address,
      monitor.network,
    );
    transactions.filter((tx) => {
      if (monitor.typeOfMonitor === 'INCOMING') {
        return tx.to === monitor.Address;
      } else {
        return tx.from === monitor.Address;
      }
    });

    if (transactions.length === 0) {
      return null;
    }
    return transactions[0];
  }

  async getNewNotifications(
    userId: string,
  ): Promise<Prisma.NotificationCreateInput[]> {
    const monitors = await this.userService.monitors({ id: userId });
    const notifications = await this.userService.notifications({ id: userId });
    const newNotifications: Prisma.NotificationCreateInput[] = [];
    for (const monitor of monitors) {
      const lastNofitication = notifications
        .slice()
        .reverse()
        .find((notification) => notification.monitorId === monitor.id);
      const lastTransaction = await this.getLastMatchingTransaction(monitor);
      const notifyThreshold = new Date(
        lastNofitication?.createdAt.getTime() + monitor.intervalMs,
      );
      if (
        lastTransaction !== null &&
        lastTransaction.timeStamp < notifyThreshold
      ) {
        continue;
      }
      newNotifications.push({
        id: uuidv4(),
        createdAt: new Date(),
        monitor: { connect: { id: monitor.id } },
        user: { connect: { id: userId } },
        read: false,
      });
    }

    return newNotifications;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkForNewNotifications() {
    console.log('checkForNewNotifications');
    const users = await this.userService.users({});
    for (const user of users) {
      const newNotifications = await this.getNewNotifications(user.id);
      await this.userService.updateNotifications({
        user: { id: user.id },
        notifications: newNotifications,
      });
    }
  }
}
