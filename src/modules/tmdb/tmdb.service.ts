import { Cache } from '@nestjs/cache-manager';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentType } from '@prisma/client';
import { Language } from 'src/common/constants/languages';
import { TimeWindow } from 'src/common/types/time-window';

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

  /*
   * Search
   */
  async search(
    query: string,
    contentType?: ContentType,
    language: Language = Language.TR,
  ) {
    const cached = await this.cacheManager.get<
      Array<(SearchMovie | SearchTv) & { media_type: ContentType }>
    >(`tmdb:search:${query}:${contentType}:${language}`);

    if (cached) {
      this.logger.log(
        `Cache hit: tmdb:search:${query}:${contentType}:${language}`,
      );
      return cached;
    }

    let movies: SearchMoviesResponse | undefined;
    let tv: SearchTvResponse | undefined;

    if (contentType !== ContentType.movie) {
      tv = await this.fetchTmdb<SearchTvResponse>(
        `search/tv?query=${query}&language=${language}`,
      );
    }
    if (contentType !== ContentType.tv) {
      movies = await this.fetchTmdb<SearchMoviesResponse>(
        `search/movie?query=${query}&language=${language}`,
      );
    }

    const combinedResults: Array<
      (SearchMovie | SearchTv) & { media_type: ContentType }
    > = [];

    const moviesArray = movies?.results || [];
    const tvArray = tv?.results || [];

    const maxLength = Math.max(moviesArray.length, tvArray.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < moviesArray.length) {
        combinedResults.push({
          media_type: ContentType.movie,
          ...moviesArray[i],
        });
      }

      if (i < tvArray.length) {
        combinedResults.push({
          media_type: ContentType.tv,
          ...tvArray[i],
        });
      }
    }

    await this.cacheManager.set(
      `tmdb:search:${query}:${contentType}:${language}`,
      combinedResults,
      3600000,
    );

    return combinedResults;
  }

  /*
   * Recommendations
   */
  async getRecommendations(
    contentType: ContentType,
    tmdbId: string,
    language: Language = Language.TR,
  ) {
    const cached = await this.cacheManager.get<
      RecommendationMoviesResponse | RecommendationTvResponse
    >(`tmdb:recommendations:${contentType}:${tmdbId}:${language}`);

    if (cached) {
      this.logger.log(
        `Cache hit: tmdb:recommendations:${contentType}:${tmdbId}:${language}`,
      );
      return cached;
    }

    const data = await this.fetchTmdb<
      RecommendationMoviesResponse | RecommendationTvResponse
    >(`${contentType}/${tmdbId}/recommendations?language=${language}`);

    await this.cacheManager.set(
      `tmdb:recommendations:${contentType}:${tmdbId}:${language}`,
      data,
      3600000,
    );

    return data;
  }

  /*
   * Popular Movies & TV
   */
  async getPopular(
    contentType: ContentType,
    language: Language = Language.TR,
    region: Language = Language.TR,
  ) {
    const cached = await this.cacheManager.get<
      PopularMoviesResponse | PopularTvResponse
    >(`tmdb:popular:${contentType}:${language}:${region}`);

    if (cached) {
      this.logger.log(
        `Cache hit: tmdb:popular:${contentType}:${language}:${region}`,
      );
      return cached;
    }

    const data = await this.fetchTmdb<
      PopularMoviesResponse | PopularTvResponse
    >(`${contentType}/popular?language=${language}&region=${region}`);

    await this.cacheManager.set(
      `tmdb:popular:${contentType}:${language}:${region}`,
      data,
      3600000,
    );

    return data;
  }

  /*
   * Now Playing
   */
  async getNowPlaying(
    language: Language = Language.TR,
    region: Language = Language.TR,
  ) {
    const cached = await this.cacheManager.get<NowPlayingMoviesResponse>(
      `tmdb:now-playing:${language}:${region}`,
    );

    if (cached) {
      this.logger.log(`Cache hit: tmdb:now-playing:${language}:${region}`);
      return cached;
    }

    const data = await this.fetchTmdb<NowPlayingMoviesResponse>(
      `movie/now_playing?language=${language}&region=${region}`,
    );

    await this.cacheManager.set(
      `tmdb:now-playing:${language}:${region}`,
      data,
      3600000,
    );

    return data;
  }

  /*
   * Trending TV & Movies
   */
  async getTrending(
    contentType: ContentType,
    language: Language = Language.TR,
    timeWindow: TimeWindow = TimeWindow.DAY,
  ) {
    const cached = await this.cacheManager.get<
      TrendingMoviesResponse | TrendingTvResponse
    >(`tmdb:trending:${contentType}:${timeWindow}:${language}`);

    if (cached) {
      this.logger.log(
        `Cache hit: tmdb:trending:${contentType}:${timeWindow}:${language}`,
      );
      return cached;
    }

    const data = await this.fetchTmdb<
      TrendingMoviesResponse | TrendingTvResponse
    >(`trending/${contentType}/${timeWindow}?language=${language}`);

    await this.cacheManager.set(
      `tmdb:trending:${contentType}:${timeWindow}:${language}`,
      data,
      3600000,
    );

    return data;
  }

  /*
   * TMDB Content Details
   */
  async getContentDetails(
    contentType: ContentType,
    tmdbId: string,
    language: Language = Language.TR,
  ) {
    const cached = await this.cacheManager.get<Movie | TV>(
      `tmdb:${contentType}:${tmdbId}:${language}`,
    );

    if (cached) {
      this.logger.log(
        `Cache hit: tmdb:detail:${contentType}:${tmdbId}:${language}`,
      );
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

      if (!response.ok) {
        throw new NotFoundException();
      }

      return data;
    } catch (error) {
      this.logger.error(`Error fetching TMDB data: ${error}`);
      throw error;
    }
  }
}
