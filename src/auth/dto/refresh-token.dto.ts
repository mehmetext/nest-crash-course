import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'REFRESH_TOKEN_REQUIRED' })
  @IsNotEmpty({ message: 'REFRESH_TOKEN_NOT_EMPTY' })
  refreshToken: string;
}
