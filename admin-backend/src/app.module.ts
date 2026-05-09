import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { DeptModule } from './modules/dept/dept.module';
import { DictModule } from './modules/dict/dict.module';
import { ConfigModule as SysConfigModule } from './modules/config/config.module';
import { LogModule } from './modules/log/log.module';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'admin_db'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', 6379)}`,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    DeptModule,
    DictModule,
    SysConfigModule,
    LogModule,
    FileModule,
  ],
})
export class AppModule {}
