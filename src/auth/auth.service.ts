import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { toSeconds } from 'src/common/utils/to-seconds';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    if (
      !this.configService.get<string>('JWT_SECRET') ||
      !this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME') ||
      !this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')
    ) {
      throw new Error(
        'JWT_SECRET, JWT_ACCESS_EXPIRATION_TIME, JWT_REFRESH_EXPIRATION_TIME are not defined in environment variables',
      );
    }
  }

  login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: toSeconds(
        this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME')!,
      ),
    };
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: number }>(refreshToken);
      const user = this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      const newPayload = { username: user.username, sub: user.id };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: toSeconds(
          this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME')!,
        ),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateUser(username: string, pass: string) {
    const user = this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    throw new UnauthorizedException();
  }
}
