import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContentType, User } from '@prisma/client';
import { Language } from 'src/common/constants/languages';
import { randomNumbers } from 'src/common/utils/random-number';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from '../tmdb/tmdb.service';
import { AddToUserListDto } from './dto/add-to-user-list.dto';
import { UpdateUserListDto } from './dto/update-user-list.dto';

@Injectable()
export class ContentService {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly prismaService: PrismaService,
  ) {}

  async explore() {
    const [
      trendingMovies,
      trendingTv,
      popularMovies,
      popularTv,
      nowPlayingMovies,
    ] = await Promise.all([
      this.tmdbService.getTrending(ContentType.movie),
      this.tmdbService.getTrending(ContentType.tv),
      this.tmdbService.getPopular(ContentType.movie),
      this.tmdbService.getPopular(ContentType.tv),
      this.tmdbService.getNowPlaying(),
    ]);

    return {
      trendingMovies: trendingMovies.results.slice(0, 5),
      trendingTv: trendingTv.results.slice(0, 5),
      popularMovies: popularMovies.results.slice(0, 5),
      popularTv: popularTv.results.slice(0, 5),
      nowPlayingMovies: nowPlayingMovies.results.slice(0, 5),
    };
  }

  async getContentDetails(
    contentType: ContentType,
    id: string,
    language: Language,
  ) {
    return this.tmdbService.getContentDetails(contentType, id, language);
  }

  async userList(user: User) {
    const list = await this.prismaService.userContent.findMany({
      where: {
        userId: user.id,
      },
    });

    const contentDetails = (
      await Promise.allSettled(
        list.map((item) =>
          this.tmdbService.getContentDetails(item.contentType, item.tmdbId),
        ),
      )
    ).map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
    });

    const updatedList = list.map((item, index) => {
      return {
        ...item,
        content: contentDetails[index],
      };
    });

    return updatedList;
  }

  async addToUserList(user: User, dto: AddToUserListDto) {
    const content = await this.tmdbService.getContentDetails(
      dto.contentType,
      dto.tmdbId,
    );

    if (!content) {
      throw new NotFoundException();
    }

    const existingContent = await this.prismaService.userContent.findFirst({
      where: {
        userId: user.id,
        ...dto,
      },
    });

    if (existingContent) {
      throw new BadRequestException();
    }

    return await this.prismaService.userContent.create({
      data: {
        userId: user.id,
        ...dto,
      },
    });
  }

  async removeFromUserList(user: User, id: string) {
    try {
      await this.prismaService.userContent.delete({
        where: {
          id,
          userId: user.id,
        },
      });
      return { message: 'SUCCESS' };
    } catch {
      throw new NotFoundException();
    }
  }

  async updateUserList(user: User, id: string, dto: UpdateUserListDto) {
    try {
      return await this.prismaService.userContent.update({
        where: {
          id,
          userId: user.id,
        },
        data: dto,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async getRecommendations(
    user: User,
  ): Promise<(RecommendationMovies | RecommendationTv)[]> {
    const list = await this.prismaService.userContent.findMany({
      where: { userId: user.id },
    });

    const randomIndexes = randomNumbers(0, list.length - 1, 3);
    const randomItems = randomIndexes.map((index) => list[index]);

    const contentDetails = (
      await Promise.allSettled(
        randomItems.map((item) =>
          this.tmdbService.getRecommendations(
            item.contentType,
            item.tmdbId,
            Language.TR,
          ),
        ),
      )
    ).map((result) => {
      if (result.status === 'fulfilled') {
        return result.value.results;
      } else {
        return [];
      }
    });

    const recommendations = contentDetails.flat();

    if (recommendations.length === 0) {
      return this.getRecommendations(user);
    }

    return recommendations;
  }

  async search(query: string, contentType?: ContentType) {
    return this.tmdbService.search(query, contentType);
  }
}
