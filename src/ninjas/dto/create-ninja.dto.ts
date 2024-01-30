import { IsEnum, IsInt, IsOptional, MinLength } from 'class-validator';

export class CreateNinjaDto {
  @IsInt()
  @IsOptional()
  id: number;

  @MinLength(3)
  name: string;

  @IsEnum(['stars', 'nunchuks'], {
    message: 'Use correct weapon',
  })
  weapon: 'stars' | 'nunchuks';
}
