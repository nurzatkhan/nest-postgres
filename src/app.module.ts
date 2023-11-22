import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './util/type-orm-config-postgres/type-orm-config-postgres.service';
import { UserModule } from './user/user.module';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: 'redis-cache',
          port: 6379,
          no_ready_check: true,
        },
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis-cache',
      port: 6379,
      no_ready_check: true, // new property
    }),

    UserModule,
  ],
})
export class AppModule {}
