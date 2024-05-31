import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailQueues } from 'src/libraries/queues/queue.constants';
import { Job } from 'bullmq';
import {
  AccountDeletionJob,
  QueueEventJobPattern,
  VerifyOtpJob,
} from 'src/libraries/queues/jobs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
@Processor(EmailQueues.AUTH_NOTIFICATION, {
  concurrency: 100,
  useWorkerThreads: true,
})
@Injectable()
export class AuthNotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(AuthNotificationProcessor.name);
  constructor(
    private _mailService: MailerService,
    private _configService: ConfigService,
  ) {
    super();
  }
  async process(
    job: Job<VerifyOtpJob['data'] | AccountDeletionJob['data'], number, string>,
  ): Promise<void> {
    try {
      switch (job.name) {
        case QueueEventJobPattern.VERIFY_OTP:
          const VerifyOtpJobData = job as Job<VerifyOtpJob['data']>;
          await this.sendVerificationEmail(VerifyOtpJobData);
          break;
        case QueueEventJobPattern.ACCOUNT_DELETION_EMAIL:
          const AccountDeletionJobData = job as Job<AccountDeletionJob['data']>;
          await this.sendAccountDeletionEmail(AccountDeletionJobData);
          return;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id}: ${error.message}`,
        error.stack,
      );
      throw error; // Throwing the error will cause the job to be re-queued for retry
    }
  }

  async sendVerificationEmail(job: Job<VerifyOtpJob['data']>) {
    // send email verification  to user
    const { email, otp, name } = job.data;
    console.log(job.data, 'Verification email');
    const context = {
      name: name,
      otp,
    };
    await this._mailService.sendMail({
      to: email,
      from: `CampusConnect ${this._configService.get<string>('SMTP_SERVICE_EMAIL')}`,
      subject: `Welcome to CampusConnect! Verify Your Email.`,
      template: 'email-verification/email-verification.ejs',
      context,
    });
  }
  async sendAccountDeletionEmail(job: Job<AccountDeletionJob['data']>) {
    // send email verification  to user
    const { email, username, date, keepAccountLink } = job.data;
    console.log(job.data, 'Verification email');
    const context = {
      username,
      date,
      keepAccountLink,
    };
    await this._mailService.sendMail({
      to: email,
      from: `CampusConnect ${this._configService.get<string>('SMTP_SERVICE_EMAIL')}`,
      subject: `Your CampusConnect account is scheduled to be deleted.`,
      template: 'account-deletion/account-deletion.ejs',
      context,
    });
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<VerifyOtpJob['data']>) {
    const { id, name, queueName, finishedOn } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.debug(`Email send Successfully to ${job.data.email}`);
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}.`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
