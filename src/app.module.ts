// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AgricultureModule } from './modules/agriculture/agriculture.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { AssociationModule } from './modules/association/association.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { FamilyModule } from './modules/family/family.module';
import { IotModule } from './modules/iot/iot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        ssl:
          config.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    AgricultureModule,
    FamilyModule,
    MarketplaceModule,
    AssociationModule,
    DeliveryModule,
    IotModule,
  ],
})
export class AppModule {}
