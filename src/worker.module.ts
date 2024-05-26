import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './libraries/queues/queue.module';
import { AuthNotificationProcessor } from './app/processors/auth.notification.processor';
import { ConfigModule } from '@nestjs/config';
import { EmailQueues } from './libraries/queues/queue.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_AUTH_NOTIFICATION_HOST,
        port: Number(process.env.REDIS_AUTH_NOTIFICATION_PORT),
        username: process.env.REDIS_AUTH_NOTIFICATION_USER,
        password: process.env.REDIS_AUTH_NOTIFICATION_PASS,
      },
      defaultJobOptions: {
        removeOnComplete: true, // Remove job from the queue once it's completed
        attempts: 3, // Number of attempts before a job is marked as failed
        removeOnFail: {
          age: 200,
          count: 10,
        },
        backoff: {
          // Optional backoff settings for retrying failed jobs
          type: 'exponential',
          delay: 60000, // Initial delay of 1 min
        },
      },
    }),

    QueueModule.register({
      queues: [EmailQueues.AUTH_NOTIFICATION],
    }),
  ],
  controllers: [],
  providers: [AuthNotificationProcessor],
})
export class WorkerModule {}
