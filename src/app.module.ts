import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdresModule } from './address/address.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('DB_NAME'),
        password: configService.get('DB_PASSWORD'),
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: [__dirname + '/libs/shared/db-migrations/*{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AdresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
