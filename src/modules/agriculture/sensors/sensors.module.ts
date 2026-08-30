// src/modules/agriculture/sensors/sensors.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from '../entities/sensor.entity';
import { Telemetry } from '../entities/telemetry.entity';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Telemetry])],
  controllers: [SensorsController],
  providers: [SensorsService],
  exports: [SensorsService],
})
export class SensorsModule {}
