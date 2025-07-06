import { Module } from '@nestjs/common';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Module({
  providers: [PasswordResetTokensService],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
