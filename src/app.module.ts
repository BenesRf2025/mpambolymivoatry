// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AgricultureModule } from './modules/agriculture/agriculture.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { AssociationModule } from './modules/association/association.module';
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
        autoLoadEntities: true,
        synchronize: true, // ⚠️ OK pour hackathon/dev, à retirer en prod
      }),
    }),
    UsersModule,
    AuthModule,
    AgricultureModule,
    MarketplaceModule,
    AssociationModule,
  ],
})
export class AppModule {}
