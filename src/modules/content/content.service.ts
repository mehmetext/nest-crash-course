import { Injectable } from '@nestjs/common';
import { ContentType } from '@prisma/client';
import { TmdbService } from '../tmdb/tmdb.service';

@Injectable()
export class ContentService {
  constructor(private readonly tmdbService: TmdbService) {}

  async explore() {
    const [trending, popular, nowPlaying, popularTv, trendingTv] =
      await Promise.all([
        this.tmdbService.getTrending(ContentType.movie),
        this.tmdbService.getTrending(ContentType.tv),
        this.tmdbService.getPopular(ContentType.movie),
        this.tmdbService.getPopular(ContentType.tv),
        this.tmdbService.getNowPlaying(ContentType.movie),
      ]);

    return {
      trending: trending.results.slice(0, 5),
      popular: popular.results.slice(0, 5),
      nowPlaying: nowPlaying.results.slice(0, 5),
      popularTv: popularTv.results.slice(0, 5),
      trendingTv: trendingTv.results.slice(0, 5),
    };
  }
}
