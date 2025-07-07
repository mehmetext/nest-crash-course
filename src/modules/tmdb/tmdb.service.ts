import { Cache } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentType } from '@prisma/client';
import { Language } from 'src/common/constants/languages';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly URL = 'https://api.themoviedb.org/3';

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

    const data = await this.fetchTmdb<Movie | TV>(
      `${contentType}/${tmdbId}?language=${language}`,
    );

    await this.cacheManager.set(
      `tmdb:${contentType}:${tmdbId}:${language}`,
      data,
      3600000,
    );

    return data;
  }

  private async fetchTmdb<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${this.URL}/${url}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.configService.get('TMDB_API_KEY')}`,
        },
      });

      const data = (await response.json()) as T;

      return data;
    } catch (error) {
      this.logger.error(`Error fetching TMDB data: ${error}`);
      throw error;
    }
  }
}
