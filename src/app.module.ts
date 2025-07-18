import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { StandardResponseModule } from 'nest-standard-response';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { EmailVerificationTokensModule } from './modules/email-verification-tokens/email-verification-tokens.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { PasswordResetTokensModule } from './modules/password-reset-tokens/password-reset-tokens.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RefreshTokensModule } from './modules/refresh-tokens/refresh-tokens.module';
import { TmdbModule } from './modules/tmdb/tmdb.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    StandardResponseModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    MailModule,
    EmailVerificationTokensModule,
    PasswordResetTokensModule,
    RefreshTokensModule,
    AuthModule,
    UsersModule,
    TmdbModule,
    ContentModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
