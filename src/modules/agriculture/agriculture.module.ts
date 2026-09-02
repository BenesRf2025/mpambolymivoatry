// src/modules/agriculture/agriculture.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Parcel } from './entities/parcel.entity';
import { Crop } from './entities/crop.entity';
import { Harvest } from './entities/harvest.entity';
import { Inspection } from './entities/inspection.entity';
import { InspectionPhoto } from './entities/inspection-photo.entity';
import { Sensor } from './entities/sensor.entity';
import { Telemetry } from './entities/telemetry.entity';
import { Listing } from './entities/listing.entity';
import { SyncAction } from './entities/sync-action.entity';

import { ParcelService } from './parcel/parcel.service';
import { ParcelController } from './parcel/parcel.controller';
import { CropService } from './crop/crop.service';
import { CropController } from './crop/crop.controller';
import { HarvestService } from './harvest/harvest.service';
import { HarvestController } from './harvest/harvest.controller';
import { InspectionService } from './inspection/inspection.service';
import { InspectionController } from './inspection/inspection.controller';
import { AiAdviceService } from './ai-advice/ai-advice.service';
import { SensorsService } from './sensors/sensors.service';
import { SensorsController } from './sensors/sensors.controller';
import { ListingsService } from './listings/listings.service';
import { ListingsController } from './listings/listings.controller';
import { SyncService } from './sync/sync.service';
import { SyncController } from './sync/sync.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parcel,
      Crop,
      Harvest,
      Inspection,
      InspectionPhoto,
      Sensor,
      Telemetry,
      Listing,
      SyncAction,
    ]),
  ],
  controllers: [
    ParcelController,
    CropController,
    HarvestController,
    InspectionController,
    SensorsController,
    ListingsController,
    SyncController,
  ],
  providers: [
    ParcelService,
    CropService,
    HarvestService,
    InspectionService,
    AiAdviceService,
    SensorsService,
    ListingsService,
    SyncService,
  ],
  exports: [ParcelService, CropService, HarvestService, AiAdviceService],
})
export class AgricultureModule {}
