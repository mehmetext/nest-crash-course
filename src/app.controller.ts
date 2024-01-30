import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('AppController.getHello()');
    return this.appService.getHello();
  }

  @Get(':id')
  getHelloById(): string {
    console.log('AppController.getHelloById()');
    return this.appService.getHello();
  }
}
