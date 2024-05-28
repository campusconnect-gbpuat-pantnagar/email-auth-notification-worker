import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkerModule } from './worker/worker.module';
import { HealthCheckController } from './healthcheck/healthcheck.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
