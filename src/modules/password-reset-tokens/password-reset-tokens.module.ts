import { Module } from '@nestjs/common';
import { PasswordResetTokensCleanupService } from './password-reset-tokens-cleanup.service';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Module({
  providers: [PasswordResetTokensService, PasswordResetTokensCleanupService],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
