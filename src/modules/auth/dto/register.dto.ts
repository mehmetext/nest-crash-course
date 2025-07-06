import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsNotEmpty({ message: 'EMAIL_NOT_EMPTY' })
  email: string;

  @IsString({ message: 'PASSWORD_REQUIRED' })
  @IsNotEmpty({ message: 'PASSWORD_NOT_EMPTY' })
  password: string;

  @IsString({ message: 'USERNAME_REQUIRED' })
  @IsNotEmpty({ message: 'USERNAME_NOT_EMPTY' })
  username: string;
}
