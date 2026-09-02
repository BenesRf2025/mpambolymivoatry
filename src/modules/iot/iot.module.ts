// src/modules/iot/iot.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IoTDevice } from './entities/iot-device.entity';
import { SensorReading } from './entities/sensor-reading.entity';
import { IrrigationConfiguration } from './entities/irrigation-configuration.entity';
import { IrrigationEvent } from './entities/irrigation-event.entity';

import { DeviceService } from './device/device.service';
import { DeviceController } from './device/device.controller';
import { SensorService } from './sensor/sensor.service';
import { SensorController } from './sensor/sensor.controller';
import { IrrigationEngineService } from './irrigation-engine/irrigation-engine.service';
import { IrrigationController } from './irrigation-engine/irrigation.controller';

import { AgricultureModule } from '../agriculture/agriculture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoTDevice,
      SensorReading,
      IrrigationConfiguration,
      IrrigationEvent,
    ]),
    AgricultureModule, // pour AiAdviceService
  ],
  controllers: [DeviceController, SensorController, IrrigationController],
  providers: [DeviceService, SensorService, IrrigationEngineService],
  exports: [DeviceService, IrrigationEngineService],
})
export class IotModule {}
