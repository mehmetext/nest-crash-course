import { Cache } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentType } from '@prisma/client';
import { Language } from 'src/common/constants/languages';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  constructor(
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    if (!this.configService.get('TMDB_API_KEY')) {
      throw new Error('TMDB_API_KEY is not set');
    }
  }

  async getContentDetails(
    contentType: ContentType,
    tmdbId: string,
    language: Language = Language.EN,
  ) {
    const cached = await this.cacheManager.get<Movie | TV>(
      `tmdb:${contentType}:${tmdbId}:${language}`,
    );

    if (cached) {
      this.logger.log(`Cache hit: tmdb:${contentType}:${tmdbId}:${language}`);
      return cached;
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/${contentType}/${tmdbId}?language=${language}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.configService.get('TMDB_API_KEY')}`,
        },
      },
    );

    const data = (await response.json()) as Movie | TV;

    await this.cacheManager.set(
      `tmdb:${contentType}:${tmdbId}:${language}`,
      data,
      3600000,
    );

    return data;
  }
}
