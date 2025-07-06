import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Injectable()
export class PasswordResetTokensCleanupService {
  private readonly logger = new Logger(PasswordResetTokensCleanupService.name);
  constructor(
    private readonly passwordResetTokensService: PasswordResetTokensService,
  ) {}

  /**
   * Her gün gece yarısı çalışır ve sadece süresi dolmuş token'ları temizler
   *
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    this.logger.log('🔄 Starting daily expired token cleanup...');

    try {
      const result =
        await this.passwordResetTokensService.cleanupExpiredTokens();

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
}
