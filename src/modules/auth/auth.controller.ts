import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { EmailVerificationTokensService } from '../email-verification-tokens/email-verification-tokens.service';
import { ForgotPasswordDto } from '../password-reset-tokens/dto/forgot-password.dto';
import { ResetPasswordDto } from '../password-reset-tokens/dto/reset-password.dto';
import { PasswordResetTokensService } from '../password-reset-tokens/password-reset-tokens.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
    private readonly emailVerificationTokensService: EmailVerificationTokensService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as Omit<User, 'password'>);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = req.user as User;
    return rest;
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  logoutFromAllDevices(@Req() req: Request) {
    return this.authService.logoutFromAllDevices((req.user as User).id);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordResetTokensService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetTokensService.resetPassword(dto);
  }

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('resend-email-verification')
  resendVerificationEmail(@Req() req: Request) {
    return this.emailVerificationTokensService.createToken(
      (req.user as User).id,
      true,
    );
  }
}
