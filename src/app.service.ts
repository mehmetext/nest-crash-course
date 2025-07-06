import { Injectable } from '@nestjs/common';
import { PrismaService } from './modules/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async cleanupDatabase() {
    await this.prisma.refreshToken.deleteMany();
    await this.prisma.passwordResetToken.deleteMany();
    await this.prisma.emailVerificationToken.deleteMany();
    await this.prisma.user.deleteMany();

    return { message: 'SUCCESS' };
  }
}
