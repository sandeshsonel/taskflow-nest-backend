import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth';

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
    AuthModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
