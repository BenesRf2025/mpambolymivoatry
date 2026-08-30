// src/modules/agriculture/sensors/sensors.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { Telemetry } from '../entities/telemetry.entity';
import { CreateTelemetryDto } from '../dto/create-telemetry.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorRepo: Repository<Sensor>,
    @InjectRepository(Telemetry)
    private readonly telemetryRepo: Repository<Telemetry>,
  ) {}

  async findAllByUser(userId: string): Promise<Sensor[]> {
    return this.sensorRepo.find({
      where: { ownerUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createTelemetry(sensorId: string, dto: CreateTelemetryDto): Promise<Telemetry> {
    const sensor = await this.sensorRepo.findOne({ where: { id: sensorId } });
    if (!sensor) {
      throw new NotFoundException('Capteur introuvable');
    }

    const now = new Date();
    const telemetry = this.telemetryRepo.create({
      sensorId,
      soilMoisture: dto.soilMoisture,
      battery: dto.battery ?? null,
      soilTemperature: dto.soilTemperature ?? null,
      airHumidity: dto.airHumidity ?? null,
      rainfallMmPerHour: dto.rainfallMmPerHour ?? null,
      timestamp: dto.timestamp ? new Date(dto.timestamp) : now,
    });

    const saved = await this.telemetryRepo.save(telemetry);

    sensor.soilMoisture = dto.soilMoisture;
    sensor.batteryLevel = dto.battery ?? sensor.batteryLevel;
    sensor.soilTemperature = dto.soilTemperature ?? sensor.soilTemperature;
    sensor.airHumidity = dto.airHumidity ?? sensor.airHumidity;
    sensor.rainfallMmPerHour = dto.rainfallMmPerHour ?? sensor.rainfallMmPerHour;
    sensor.lastTransmission = now;
    await this.sensorRepo.save(sensor);

    return saved;
  }
}
