import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule);
  Logger.log(
    'EMAIL NOTIFICATION WORKER HAS STARTED SUCCESSFULLY 🚀.',
    'Main.ts',
  );
}

bootstrap();
