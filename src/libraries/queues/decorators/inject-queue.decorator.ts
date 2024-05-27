import { InjectQueue } from '@nestjs/bullmq';
import { EmailQueues } from '../queue.constants';

export const InjectAuthNotificationQueue = () =>
  InjectQueue(EmailQueues.AUTH_NOTIFICATION);
