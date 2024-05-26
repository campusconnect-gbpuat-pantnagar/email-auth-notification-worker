import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailQueues } from 'src/libraries/queues/queue.constants';
import { Job } from 'bullmq';
import { VerifyOtpJob } from 'src/libraries/queues/jobs';
@Processor(EmailQueues.AUTH_NOTIFICATION, {
  concurrency: 50,
  useWorkerThreads: true,
})
@Injectable()
export class AuthNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(AuthNotificationProcessor.name);
  constructor() {
    super();
  }
  async process(job: Job<VerifyOtpJob['data'], number, string>): Promise<void> {
    // we are getting the gbpuatEmail, otp,name
    // ✅ TODO: sending email to user
    console.log('Processing', job.name);
  }
}
