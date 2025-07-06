import { Controller, Get, Param, ParseEnumPipe, Query } from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { Language } from 'src/common/constants/languages';
import { TmdbService } from './tmdb.service';

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('/:contentType/:id')
  async getContentDetails(
    @Param('contentType', new ParseEnumPipe(ContentType))
    contentType: ContentType,
    @Param('id') id: string,
    @Query(
      'language',
      new ParseEnumPipe(Language, {
        optional: true,
      }),
    )
    language: Language,
  ) {
    return this.tmdbService.getContentDetails(contentType, id, language);
  }
}
