import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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

  /*
   * Geçersiz kılınmış token'ları temizler
   */
  async deleteRevokedTokens() {
    return this.prisma.refreshToken.deleteMany({
      where: { isRevoked: true },
    });
  }

  /**
   * Belirli bir tarihten eski token'ları temizler
   */
  async deleteOldTokens(olderThanDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return this.prisma.refreshToken.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }

  /**
   * Tüm temizleme işlemlerini yapar
   */
  async cleanupTokens() {
    const results = {
      expired: 0,
      revoked: 0,
      old: 0,
    };

    try {
      // Süresi dolmuş token'ları sil
      const expiredResult = await this.deleteExpiredTokens();
      results.expired = expiredResult.count;

      // Geçersiz kılınmış token'ları sil
      const revokedResult = await this.deleteRevokedTokens();
      results.revoked = revokedResult.count;

      // 30 günden eski token'ları sil
      const oldResult = await this.deleteOldTokens(30);
      results.old = oldResult.count;

      return results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Token cleanup failed: ${error.message}`);
      }
      throw new Error('Token cleanup failed');
    }
  }
}
