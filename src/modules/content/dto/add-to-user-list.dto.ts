import { ContentType, WatchStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddToUserListDto {
  @IsString()
  tmdbId: string;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsEnum(WatchStatus)
  watchStatus: WatchStatus;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsString()
  @IsOptional()
  notes: string;
}
