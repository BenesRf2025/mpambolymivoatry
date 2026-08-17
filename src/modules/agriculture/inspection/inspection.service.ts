// src/modules/agriculture/inspection/inspection.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from '../entities/inspection.entity';
import {
  CreateInspectionDto,
  CompleteInspectionDto,
} from '../dto/create-inspection.dto';
import { InspectionStatus } from '../enums/inspection-status.enum';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepo: Repository<Inspection>,
  ) {}

  async create(userId: string, dto: CreateInspectionDto): Promise<Inspection> {
    const inspection = this.inspectionRepo.create({
      parcelId: dto.parcelId,
      inspectorUserId: userId,
      observation: dto.observation ?? null,
      status: InspectionStatus.EN_COURS,
    });
    return this.inspectionRepo.save(inspection);
  }

  async complete(id: string, dto: CompleteInspectionDto): Promise<Inspection> {
    const inspection = await this.inspectionRepo.findOne({ where: { id } });
    if (!inspection) throw new NotFoundException('Inspection introuvable');

    inspection.status = InspectionStatus.TERMINEE;
    inspection.observation = dto.observation ?? inspection.observation;
    inspection.voiceNoteUrl = dto.voiceNoteUrl ?? inspection.voiceNoteUrl;
    inspection.completedAt = new Date();

    return this.inspectionRepo.save(inspection);
  }

  async findByParcel(parcelId: string): Promise<Inspection[]> {
    return this.inspectionRepo.find({
      where: { parcelId },
      relations: { photos: true }, // 🔧
      order: { createdAt: 'DESC' },
    });
  }
}
