import { Module } from '@nestjs/common';
import { EmailVerificationTokensCleanupService } from './email-verification-tokens-cleanup.service';
import { EmailVerificationTokensService } from './email-verification-tokens.service';

@Module({
  providers: [
    EmailVerificationTokensService,
    EmailVerificationTokensCleanupService,
  ],
  exports: [EmailVerificationTokensService],
})
export class EmailVerificationTokensModule {}
