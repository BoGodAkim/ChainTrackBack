import { Module } from '@nestjs/common';
import { AppControllerApp } from './app.controller_app';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AppControllerAdmin } from './app.controller_admin';

@Module({
  imports: [DatabaseModule],
  controllers: [AppControllerApp, AppControllerAdmin],
  providers: [AppService],
})
export class AppModule {}
