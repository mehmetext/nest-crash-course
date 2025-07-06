import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokensService } from './refresh-tokens.service';

@Injectable()
export class RefreshTokensCleanupService {
  private readonly logger = new Logger(RefreshTokensCleanupService.name);
  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  /*
   * Her gün gece yarısı çalışır ve sadece süresi dolmuş token'ları temizler
   * Bu, veritabanı yükünü azaltmak için sadece expired token'ları temizler
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    this.logger.log('🔄 Starting daily expired token cleanup...');

    try {
      const result = await this.refreshTokensService.deleteExpiredTokens();

      if (result.count > 0) {
        this.logger.log(
          `✅ Daily cleanup: ${result.count} expired tokens deleted`,
        );
      } else {
        this.logger.debug('✅ Daily cleanup: No expired tokens found');
      }
    } catch (error) {
      this.logger.error('❌ Error during daily token cleanup:', error);
      // Kritik hata durumunda tekrar deneme mekanizması eklenebilir
    }
  }

  /**
   * Her hafta Pazar günü saat 02:00'de çalışır ve kapsamlı temizlik yapar
   * Gece yarısı temizliğinden 2 saat sonra çalışarak çakışmayı önler
   */
  @Cron('0 2 * * 0') // Her Pazar saat 02:00
  async weeklyDeepCleanup() {
    this.logger.log('🔄 Starting weekly deep cleanup...');

    try {
      const results = await this.refreshTokensService.cleanupTokens();

      this.logger.log(
        `✅ Weekly cleanup completed: ${results.expired} expired, ${results.revoked} revoked, ${results.old} old tokens deleted`,
      );
    } catch (error) {
      this.logger.error('❌ Error during weekly cleanup:', error);
      // Haftalık temizlik kritik olduğu için daha detaylı hata yönetimi
      throw error; // Üst seviyeye hata fırlat
    }
  }

  /**
   * Manuel temizlik için kullanılabilir metod
   * Test veya acil durumlar için
   * Bu metod cron ile çalışmaz, sadece manuel olarak çağrılır
   */
  async manualCleanup() {
    this.logger.log('🔄 Starting manual cleanup...');

    try {
      const results = await this.refreshTokensService.cleanupTokens();

      this.logger.log(
        `✅ Manual cleanup completed: ${results.expired} expired, ${results.revoked} revoked, ${results.old} old tokens deleted`,
      );

      return results;
    } catch (error) {
      this.logger.error('❌ Error during manual cleanup:', error);
      throw error;
    }
  }
}
