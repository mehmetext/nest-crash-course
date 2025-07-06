import { Module } from '@nestjs/common';
import { UserContentController } from './user-content.controller';
import { UserContentService } from './user-content.service';

@Module({
  controllers: [UserContentController],
  providers: [UserContentService],
})
export class UserContentModule {}
