// src/modules/iot/sensor/sensor.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorReading } from '../entities/sensor-reading.entity';
import { SensorReadingDto } from '../dto/sensor-reading.dto';
import { DeviceService } from '../device/device.service';
import { IrrigationEngineService } from '../irrigation-engine/irrigation-engine.service';
import { AiAdviceService } from '../../agriculture/ai-advice/ai-advice.service';

@Injectable()
export class SensorService {
  private readonly logger = new Logger(SensorService.name);

  constructor(
    @InjectRepository(SensorReading)
    private readonly readingRepo: Repository<SensorReading>,
    private readonly deviceService: DeviceService,
    private readonly irrigationEngine: IrrigationEngineService,
    private readonly aiAdviceService: AiAdviceService,
  ) {}

  async ingest(dto: SensorReadingDto) {
    const device = await this.deviceService.findByCode(dto.deviceCode);

    // Enregistre la lecture
    const reading = this.readingRepo.create({
      deviceId: device.id,
      soilHumidity: dto.soilHumidity ?? null,
      temperature: dto.temperature ?? null,
      airHumidity: dto.airHumidity ?? null,
      rainfall: dto.rainfall ?? null,
      waterLevel: dto.waterLevel ?? null,
      batteryVoltage: dto.batteryVoltage ?? null,
    });
    const savedReading = await this.readingRepo.save(reading);

    // Met à jour le "last seen" du device
    await this.deviceService.updateLastSeen(
      device.id,
      dto.batteryVoltage ? (dto.batteryVoltage / 4.2) * 100 : undefined,
    );

    // Évalue le déclenchement d'irrigation automatique
    const irrigationDecision = await this.irrigationEngine.evaluateAndTrigger(
      device.parcelId,
      dto.soilHumidity,
    );

    // Génère un conseil (règles simples déjà codées dans Agriculture)
    const advice = this.aiAdviceService.generateAdvice({
      cropName: 'Culture',
      soilHumidity: dto.soilHumidity,
      temperature: dto.temperature,
    });

    this.logger.log(
      `📡 Donnée reçue de ${dto.deviceCode} - Humidité: ${dto.soilHumidity}%`,
    );

    return {
      reading: savedReading,
      irrigation: irrigationDecision,
      advice,
    };
  }

  async getHistoryByParcel(
    parcelId: string,
    limit = 50,
  ): Promise<SensorReading[]> {
    const devices = await this.deviceService.findByParcel(parcelId);
    const deviceIds = devices.map((d) => d.id);

    if (deviceIds.length === 0) return [];

    return this.readingRepo
      .createQueryBuilder('reading')
      .where('reading.deviceId IN (:...deviceIds)', { deviceIds })
      .orderBy('reading.measuredAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getLatestByParcel(parcelId: string): Promise<SensorReading | null> {
    const history = await this.getHistoryByParcel(parcelId, 1);
    return history[0] ?? null;
  }
}
