import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokensModule } from 'src/modules/refresh-tokens/refresh-tokens.module';
import { UsersModule } from 'src/modules/users/users.module';
import { EmailVerificationTokensModule } from '../email-verification-tokens/email-verification-tokens.module';
import { PasswordResetTokensModule } from '../password-reset-tokens/password-reset-tokens.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    RefreshTokensModule,
    PasswordResetTokensModule,
    EmailVerificationTokensModule,
  ],
})
export class AuthModule {}
