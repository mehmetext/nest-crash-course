import { Module } from '@nestjs/common';
import { TmdbModule } from '../tmdb/tmdb.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [TmdbModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
