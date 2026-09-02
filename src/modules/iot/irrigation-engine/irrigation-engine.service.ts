// src/modules/iot/irrigation-engine/irrigation-engine.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { IrrigationConfiguration } from '../entities/irrigation-configuration.entity';
import { IrrigationEvent } from '../entities/irrigation-event.entity';
import { IrrigationMode } from '../enums/irrigation-mode.enum';

export interface IrrigationDecision {
  triggered: boolean;
  reason: string;
  event?: IrrigationEvent;
}

@Injectable()
export class IrrigationEngineService {
  private readonly logger = new Logger(IrrigationEngineService.name);

  constructor(
    @InjectRepository(IrrigationConfiguration)
    private readonly configRepo: Repository<IrrigationConfiguration>,
    @InjectRepository(IrrigationEvent)
    private readonly eventRepo: Repository<IrrigationEvent>,
  ) {}

  /**
   * Évalue si l'irrigation doit se déclencher automatiquement
   * suite à une nouvelle lecture de capteur.
   */
  async evaluateAndTrigger(
    parcelId: string,
    soilHumidity: number | null | undefined,
  ): Promise<IrrigationDecision> {
    if (soilHumidity === null || soilHumidity === undefined) {
      return { triggered: false, reason: 'Pas de donnée humidité disponible' };
    }

    const config = await this.configRepo.findOne({ where: { parcelId } });

    if (!config || !config.enabled) {
      return {
        triggered: false,
        reason: 'Irrigation désactivée ou non configurée pour cette parcelle',
      };
    }

    if (config.mode !== IrrigationMode.AUTOMATIQUE) {
      return {
        triggered: false,
        reason: 'Mode manuel actif, déclenchement automatique désactivé',
      };
    }

    if (soilHumidity >= config.minimumHumidity) {
      return {
        triggered: false,
        reason: `Humidité suffisante (${soilHumidity}% ≥ seuil ${config.minimumHumidity}%)`,
      };
    }

    // Vérifie qu'il n'y a pas déjà un événement en cours pour éviter les doublons
    const ongoing = await this.eventRepo.findOne({
      where: { parcelId, endedAt: IsNull() },
    });
    if (ongoing) {
      return {
        triggered: false,
        reason: 'Irrigation déjà en cours sur cette parcelle',
      };
    }

    // Déclenchement de l'irrigation automatique
    const event = this.eventRepo.create({
      parcelId,
      startedAt: new Date(),
      durationSeconds: config.durationSeconds,
      triggerSource: 'AUTO_SENSOR',
      waterVolumeLiter: this.estimateWaterVolume(config.durationSeconds),
    });

    const saved = await this.eventRepo.save(event);

    this.logger.log(
      `💧 Irrigation AUTO déclenchée - Parcelle ${parcelId} - Humidité: ${soilHumidity}% < seuil ${config.minimumHumidity}%`,
    );

    // Simule la fin de l'irrigation après la durée configurée
    this.scheduleAutoEnd(saved.id, config.durationSeconds);

    return {
      triggered: true,
      reason: `Humidité basse (${soilHumidity}% < seuil ${config.minimumHumidity}%). Irrigation lancée pour ${config.durationSeconds}s.`,
      event: saved,
    };
  }

  private estimateWaterVolume(durationSeconds: number): number {
    // Estimation simple : débit moyen de 2 litres/minute pour un système goutte-à-goutte
    const flowRateLPerMinute = 2;
    return (durationSeconds / 60) * flowRateLPerMinute;
  }

  private scheduleAutoEnd(eventId: string, durationSeconds: number): void {
    setTimeout(async () => {
      await this.eventRepo.update(eventId, { endedAt: new Date() });
      this.logger.log(`✅ Irrigation terminée - Event ${eventId}`);
    }, durationSeconds * 1000);
  }

  async getConfigOrCreateDefault(
    parcelId: string,
  ): Promise<IrrigationConfiguration> {
    let config = await this.configRepo.findOne({ where: { parcelId } });
    if (!config) {
      config = this.configRepo.create({ parcelId });
      config = await this.configRepo.save(config);
    }
    return config;
  }

  async updateConfig(
    parcelId: string,
    updates: Partial<IrrigationConfiguration>,
  ): Promise<IrrigationConfiguration> {
    const config = await this.getConfigOrCreateDefault(parcelId);
    Object.assign(config, updates);
    return this.configRepo.save(config);
  }

  async getHistory(parcelId: string): Promise<IrrigationEvent[]> {
    return this.eventRepo.find({
      where: { parcelId },
      order: { startedAt: 'DESC' },
      take: 20,
    });
  }

  async manualTrigger(parcelId: string): Promise<IrrigationEvent> {
    const config = await this.getConfigOrCreateDefault(parcelId);

    const event = this.eventRepo.create({
      parcelId,
      startedAt: new Date(),
      durationSeconds: config.durationSeconds,
      triggerSource: 'MANUAL',
      waterVolumeLiter: this.estimateWaterVolume(config.durationSeconds),
    });

    const saved = await this.eventRepo.save(event);
    this.scheduleAutoEnd(saved.id, config.durationSeconds);

    return saved;
  }
}
