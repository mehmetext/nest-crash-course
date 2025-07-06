import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'TOKEN_REQUIRED' })
  @IsString()
  token: string;
}
