import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationToken } from '@prisma/client';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailVerificationTokensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createToken(userId: string, resend: boolean = false) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, isEmailVerified: false },
    });

    if (!user) return null;

    await this.prisma.emailVerificationToken.updateMany({
      where: { userId, isUsed: false, expiresAt: { gt: new Date() } },
      data: { isUsed: true },
    });

    const verificationToken = await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        token: randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
      },
    });

    if (!resend) {
      await this.mailService.sendMail({
        to: [user.email],
        subject: 'Hoş Geldin!',
        html: `<h1>Selam, ${user.username}!</h1>
        <p>Aramız hoş geldin.</p>
        <p>Aşağıdaki linkten hesabınızı doğrulayabilirsiniz:</p>
        <a href="${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${verificationToken.token}">Doğrula</a>`,
      });
    } else {
      await this.mailService.sendMail({
        to: [user.email],
        subject: 'Doğrulama Linki',
        html: `<h1>Doğrulama Linki</h1>
        <p>Aşağıdaki linkten hesabınızı doğrulayabilirsiniz:</p>
        <a href="${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${verificationToken.token}">Doğrula</a>`,
      });
    }

    return { message: 'SUCCESS' };
  }

  async verifyToken(token: string) {
    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { token },
      });

    if (!verificationToken) {
      throw new NotFoundException();
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException();
    }

    if (verificationToken.isUsed) {
      throw new BadRequestException();
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { isUsed: true },
      }),
      this.prisma.user.update({
        where: { id: verificationToken.userId },
        data: { isEmailVerified: true },
      }),
    ]);

    return { message: 'SUCCESS' };
  }

  async findActiveTokenByUserId(
    userId: string,
  ): Promise<EmailVerificationToken | null> {
    return this.prisma.emailVerificationToken.findFirst({
      where: {
        userId,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async cleanupExpiredTokens() {
    return await this.prisma.emailVerificationToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
  }
}
