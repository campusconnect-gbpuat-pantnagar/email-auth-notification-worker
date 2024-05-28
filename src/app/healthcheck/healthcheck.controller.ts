import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthcheck() {
    return 'EMAIL-AUTH-NOTIFICATION-WORKER SERVICE IS HEALTHY ✅ 🚀.';
  }
}
