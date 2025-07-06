import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'TOKEN_INVALID' })
  @IsNotEmpty({ message: 'TOKEN_REQUIRED' })
  token: string;

  @IsString({ message: 'NEW_PASSWORD_INVALID' })
  @IsNotEmpty({ message: 'NEW_PASSWORD_REQUIRED' })
  newPassword: string;
}
