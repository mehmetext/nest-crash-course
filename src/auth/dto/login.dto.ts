import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'USERNAME_REQUIRED' })
  @IsNotEmpty({ message: 'USERNAME_NOT_EMPTY' })
  username: string;

  @IsString({ message: 'PASSWORD_REQUIRED' })
  @IsNotEmpty({ message: 'PASSWORD_NOT_EMPTY' })
  password: string;
}
