import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokensService } from './refresh-tokens.service';

@Injectable()
export class RefreshTokensCleanupService {
  private readonly logger = new Logger(RefreshTokensCleanupService.name);
  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  /*
   * Her gün gece yarısı çalışır ve eski token'ları temizler
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    this.logger.log('🔄 Starting daily refresh token cleanup...');

    try {
      const results = await this.refreshTokensService.cleanupTokens();

      this.logger.log(
        `✅ Cleanup completed: ${results.expired} expired, ${results.revoked} revoked, ${results.old} old tokens deleted`,
      );
    } catch (error) {
      this.logger.error('❌ Error during token cleanup:', error);
    }
  }

  /**
   * Her saat başı çalışır ve sadece süresi dolmuş token'ları temizler
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokensHourly() {
    this.logger.debug('🔄 Hourly cleanup: removing expired tokens...');

    try {
      const result = await this.refreshTokensService.deleteExpiredTokens();

      if (result.count > 0) {
        this.logger.log(
          `✅ Hourly cleanup: ${result.count} expired tokens deleted`,
        );
      }
    } catch (error) {
      this.logger.error('❌ Error during hourly cleanup:', error);
    }
  }

  /**
   * Her hafta Pazar günü çalışır ve kapsamlı temizlik yapar
   */
  @Cron(CronExpression.EVERY_WEEK)
  async weeklyDeepCleanup() {
    this.logger.log('🔄 Starting weekly deep cleanup...');

    try {
      const results = await this.refreshTokensService.cleanupTokens();

      this.logger.log(
        `✅ Weekly cleanup completed: ${results.expired} expired, ${results.revoked} revoked, ${results.old} old tokens deleted`,
      );
    } catch (error) {
      this.logger.error('❌ Error during weekly cleanup:', error);
    }
  }
}
