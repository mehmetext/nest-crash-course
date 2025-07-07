import { ContentType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SearchContentDto {
  @IsNotEmpty()
  query: string;

  @IsEnum(ContentType)
  @IsOptional()
  contentType: ContentType;
}
