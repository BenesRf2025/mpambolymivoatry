// src/modules/delivery/delivery.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveryProfile } from './entities/delivery-profile.entity';
import { Delivery } from './entities/delivery.entity';

import { DeliveryProfileService } from './delivery-profile/delivery-profile.service';
import { DeliveryProfileController } from './delivery-profile/delivery-profile.controller';
import { DeliveryService } from './delivery/delivery.service';
import { DeliveryController } from './delivery/delivery.controller';
import { GeoService } from './geo/geo.service';

import { MarketplaceModule } from '../marketplace/marketplace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryProfile, Delivery]),
    forwardRef(() => MarketplaceModule),
  ],
  controllers: [DeliveryProfileController, DeliveryController],
  providers: [DeliveryProfileService, DeliveryService, GeoService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
