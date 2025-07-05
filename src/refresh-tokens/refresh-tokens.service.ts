import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokensService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Kullanıcı için yeni bir refresh token oluşturur
   */
  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  /**
   * Token'a göre refresh token'ı bulur
   */
  async findByToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * Kullanıcının tüm refresh token'larını getirir
   */
  async findByUserId(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: { userId },
    });
  }

  /**
   * Refresh token'ı geçersiz kılar (revoke)
   */
  async revokeToken(token: string) {
    return this.prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  /**
   * Kullanıcının tüm refresh token'larını geçersiz kılar
   */
  async revokeAllUserTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  /**
   * Süresi dolmuş token'ları temizler
   */
  async deleteExpiredTokens() {
    return this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Token'ın geçerli olup olmadığını kontrol eder
   */
  async isTokenValid(token: string): Promise<boolean> {
    const refreshToken = await this.findByToken(token);

    if (!refreshToken) {
      return false;
    }

    // Token geçersiz kılınmış mı?
    if (refreshToken.isRevoked) {
      return false;
    }

    // Token süresi dolmuş mu?
    if (refreshToken.expiresAt < new Date()) {
      return false;
    }

    return true;
  }
}
