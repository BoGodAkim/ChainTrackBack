import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      name: 'siwe',
      secret: 'O73',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: true, sameSite: true },
    }),
  );
  await app.listen(3000);
}
bootstrap();
