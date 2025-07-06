import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { toSeconds } from 'src/common/utils/to-seconds';
import { RefreshTokensService } from 'src/modules/refresh-tokens/refresh-tokens.service';
import { UsersService } from 'src/modules/users/users.service';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly mailService: MailService,
  ) {
    if (
      !this.configService.get<string>('JWT_ACCESS_SECRET') ||
      !this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME') ||
      !this.configService.get<string>('JWT_REFRESH_SECRET') ||
      !this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')
    ) {
      throw new Error(
        'JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRATION_TIME, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION_TIME are not defined in environment variables',
      );
    }
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { sub: user.id };
    const accessTokenExpiresIn =
      this.configService.get<string>('NODE_ENV') === 'development'
        ? '30d'
        : this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME')!;

    const refreshTokenExpiresIn =
      this.configService.get<string>('NODE_ENV') === 'development'
        ? '30d'
        : this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')!;

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiresIn,
    });

    await this.refreshTokensService.createRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + toSeconds(refreshTokenExpiresIn) * 1000),
    );

    return {
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: toSeconds(accessTokenExpiresIn),
      },
      user: user,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const isValid = await this.refreshTokensService.isTokenValid(
        dto.refreshToken,
      );
      if (!isValid) {
        throw new UnauthorizedException();
      }

      const payload = this.jwtService.verify<{ sub: string }>(dto.refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      await this.refreshTokensService.revokeToken(dto.refreshToken);

      const accessTokenExpiresIn =
        this.configService.get<string>('NODE_ENV') === 'development'
          ? '30d'
          : this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME')!;

      const refreshTokenExpiresIn =
        this.configService.get<string>('NODE_ENV') === 'development'
          ? '30d'
          : this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')!;

      const newPayload = { username: user.username, sub: user.id };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: accessTokenExpiresIn,
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: refreshTokenExpiresIn,
      });

      await this.refreshTokensService.createRefreshToken(
        user.id,
        newRefreshToken,
        new Date(Date.now() + toSeconds(refreshTokenExpiresIn) * 1000),
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: toSeconds(accessTokenExpiresIn),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateUser(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    throw new UnauthorizedException();
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    await this.mailService.sendMail({
      to: [user.email],
      subject: 'Hoş Geldin!',
      html: `<h1>Selam, ${user.username}!</h1>
      <p>Aramız hoş geldin.</p>`,
    });
    return this.login(user);
  }

  async logoutFromAllDevices(userId: string) {
    await this.refreshTokensService.revokeAllUserTokens(userId);
    return { message: 'SUCCESS' };
  }

  async logout(refreshToken: string) {
    await this.refreshTokensService.revokeToken(refreshToken);
    return { message: 'SUCCESS' };
  }
}
