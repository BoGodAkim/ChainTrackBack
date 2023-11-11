import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationsService } from './notifications/notifications.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // let notificationsService = app.get(NotificationsService);
  // notificationsService.sendMessages([{
  //   id: 0,
  //   alert: {
  //     id: 0,
  //     isUrgent: false,
  //     categoryId: 0,
  //     dateOfCreation: new Date(),
  //     dateOfStart: new Date(),
  //     dateOfEnd: new Date(),
  //     description: "Test",
  //     isActive: true,
  //     areas: [],
  //     notifications: [],
  //   },
  //   title: "Miscellaneous",
  //   body: "Stas Stankevich isn't pidor, but another Stas is pidor",
  //   device: {
  //     id: "Test",
  //     lastCoordinates: {
  //       x: 0,
  //       y: 0,
  //       radius: 0,
  //     },
  //     timestamp: new Date(),
  //     notificationAddresses: [],
  //     coordinates: [],
  //     notifications: [],
  //     fcmToken: 'euGCNw8SSV2-G9YNOUVAs0:APA91bGnrMFPvRtB--7bFySnXnR6aWXYVaCWSXJPz2wWTYsGAgMSLZcZ5at24mJI5CSajaTBtWJEbeyiMnSki7XNfipwidGOtMRqq0RP7VSV0z8BgNQgZ_-X2GCJVF7DnJrHcXvq_et-',
  //   },
  // }
  // ]);
}
bootstrap();
