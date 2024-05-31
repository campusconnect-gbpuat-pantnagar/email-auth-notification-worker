import { QueueEventJobPattern } from './job.pattern';

export interface VerifyOtpJob {
  pattern: QueueEventJobPattern.VERIFY_OTP;
  data: {
    email: string;
    otp: number;
    name: string;
  };
}

export interface AccountDeletionJob {
  pattern: QueueEventJobPattern.ACCOUNT_DELETION_EMAIL;
  data: {
    email: string;
    keepAccountLink: string;
    date: string;
    username: string;
  };
}
