import { Controller, Get } from '@nestjs/common';
import { Health } from './entites/health.entity';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): Health {
    return this.healthService.check();
  }
}
