import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './database/user.service';
import { MonitorService } from './database/monitor.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService, MonitorService, PrismaService],
})
export class AppModule {}
