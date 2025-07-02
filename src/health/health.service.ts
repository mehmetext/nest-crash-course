import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Health } from './entites/health.entity';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  check(): Health {
    return {
      port: this.configService.get<string>('PORT'),
      status: 'ok',
    };
  }
}
