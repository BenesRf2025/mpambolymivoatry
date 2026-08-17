// src/modules/agriculture/agriculture.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Parcel } from './entities/parcel.entity';
import { Crop } from './entities/crop.entity';
import { Harvest } from './entities/harvest.entity';
import { Inspection } from './entities/inspection.entity';
import { InspectionPhoto } from './entities/inspection-photo.entity';

import { ParcelService } from './parcel/parcel.service';
import { ParcelController } from './parcel/parcel.controller';
import { CropService } from './crop/crop.service';
import { CropController } from './crop/crop.controller';
import { HarvestService } from './harvest/harvest.service';
import { HarvestController } from './harvest/harvest.controller';
import { InspectionService } from './inspection/inspection.service';
import { InspectionController } from './inspection/inspection.controller';
import { AiAdviceService } from './ai-advice/ai-advice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Parcel,
      Crop,
      Harvest,
      Inspection,
      InspectionPhoto,
    ]),
  ],
  controllers: [
    ParcelController,
    CropController,
    HarvestController,
    InspectionController,
  ],
  providers: [
    ParcelService,
    CropService,
    HarvestService,
    InspectionService,
    AiAdviceService,
  ],
  exports: [ParcelService, CropService, HarvestService],
})
export class AgricultureModule {}
