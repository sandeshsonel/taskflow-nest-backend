import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  I18nModule,
  AcceptLanguageResolver,
  HeaderResolver,
  QueryResolver,
} from 'nestjs-i18n';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import Redis from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
  AccountModule,
  BugReportModule,
  TaskModule,
  HealthModule,
  JwtAuthGuard,
  AdminUserModule,
  NotificationModule,
  LoggerModule
} from '@modules';
import { CustomThrottlerGuard } from './common/throttler/throttler.guard';

const FEATURE_MODULES = [
  AuthModule,
  AccountModule,
  BugReportModule,
  TaskModule,
  HealthModule,
  AdminUserModule,
  NotificationModule,
  LoggerModule
];

import { configs, validate } from './config';

const environment = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${environment}`,
      load: configs,
      validate,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');
        const dbName = configService.get<string>('database.name');
        const options = configService.get<any>('database.options');
        return {
          uri,
          dbName,
          ...options,
        };
      },
      inject: [ConfigService],
    }),
    ...FEATURE_MODULES,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads', 'bug-attachments'),
      serveRoot: '/bug-attachments',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: config.get('throttler.ttl'),
            limit: config.get('throttler.limit'),
          },
        ],
        storage: config.get('throttler.redis.enabled')
          ? new ThrottlerStorageRedisService(
            new Redis({
              host: config.get('throttler.redis.host'),
              port: config.get('throttler.redis.port'),
            }),
          )
          : undefined,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
