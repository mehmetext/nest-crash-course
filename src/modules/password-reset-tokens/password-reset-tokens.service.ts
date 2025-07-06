import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) return null;

    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, isUsed: false, expiresAt: { gt: new Date() } },
      data: { isUsed: true },
    });

    const token = await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: this.generateSecureToken(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
      },
    });

    await this.mailService.sendMail({
      to: [dto.email],
      subject: 'Şifre Sıfırlama',
      text: `Şifrenizi sıfırlamak için aşağıdaki linki kullanınız: /reset-password?token=${token.token}`,
    });

    return { message: 'SUCCESS' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const token = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!token) throw new BadRequestException();

    if (token.isUsed) throw new BadRequestException();

    if (token.expiresAt < new Date()) throw new BadRequestException();

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: token.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { isUsed: true },
      }),
    ]);

    await this.prisma.refreshToken.updateMany({
      where: { userId: token.userId },
      data: { isRevoked: true },
    });

    return { message: 'SUCCESS' };
  }

  /**
   * Güvenli token oluşturur
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async cleanupExpiredTokens() {
    const result = await this.prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return { count: result.count };
  }
}
