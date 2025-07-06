import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailVerificationTokensService } from './email-verification-tokens.service';

@Injectable()
export class EmailVerificationTokensCleanupService {
  private readonly logger = new Logger(
    EmailVerificationTokensCleanupService.name,
  );
  constructor(
    private readonly emailVerificationTokensService: EmailVerificationTokensService,
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
        await this.emailVerificationTokensService.cleanupExpiredTokens();

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
