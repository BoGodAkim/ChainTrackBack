import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './database/user.service';
import { MonitorService } from './database/monitor.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService, MonitorService],
})
export class AppModule {}
