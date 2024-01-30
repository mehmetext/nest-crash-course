import { Body, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('AppService.getHello()');
    return 'Hello World!';
  }

  showBody(@Body() body: any): any {
    return JSON.stringify(body);
  }
}
