import { Module } from '@nestjs/common';
import { EmailVerificationTokensService } from './email-verification-tokens.service';

@Module({
  providers: [EmailVerificationTokensService],
  exports: [EmailVerificationTokensService],
})
export class EmailVerificationTokensModule {}
