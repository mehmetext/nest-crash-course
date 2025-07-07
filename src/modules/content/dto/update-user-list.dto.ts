import { WatchStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserListDto {
  @IsEnum(WatchStatus)
  @IsOptional()
  watchStatus: WatchStatus;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsString()
  @IsOptional()
  notes: string;
}
