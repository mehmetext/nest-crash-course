import { Module } from '@nestjs/common';
import { RefreshTokensCleanupService } from './refresh-tokens-cleanup.service';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
  providers: [RefreshTokensService, RefreshTokensCleanupService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
