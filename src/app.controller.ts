import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('AppController.getHello()');
    return this.appService.getHello();
  }

  @Post()
  showBody(@Body() body: any): any {
    return this.appService.showBody(body);
  }

  @Get(':id')
  getHelloById(): string {
    console.log('AppController.getHelloById()');
    return this.appService.getHello();
  }
}
