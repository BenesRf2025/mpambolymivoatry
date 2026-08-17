// src/modules/agriculture/harvest/harvest.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Harvest } from '../entities/harvest.entity';
import { CreateHarvestDto } from '../dto/create-harvest.dto';
import { HarvestStatus } from '../enums/harvest-status.enum';
import { CropService } from '../crop/crop.service';

@Injectable()
export class HarvestService {
  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepo: Repository<Harvest>,
    private readonly cropService: CropService,
  ) {}

  async create(dto: CreateHarvestDto): Promise<Harvest> {
    // Vérifie que la culture existe
    await this.cropService.findOne(dto.cropId);

    const harvest = this.harvestRepo.create({
      cropId: dto.cropId,
      harvestedAt: new Date(dto.harvestedAt),
      quantityKg: dto.quantityKg,
      qualityGrade: dto.qualityGrade ?? 'B',
      status: HarvestStatus.DISPONIBLE,
    });

    return this.harvestRepo.save(harvest);
  }

  // Utile pour le futur module Marketplace (stock disponible à vendre)
  async findAvailableByUser(userId: string): Promise<Harvest[]> {
    return this.harvestRepo
      .createQueryBuilder('harvest')
      .innerJoin('harvest.crop', 'crop')
      .innerJoin('crop.parcel', 'parcel')
      .where('parcel.ownerUserId = :userId', { userId })
      .andWhere('harvest.status = :status', {
        status: HarvestStatus.DISPONIBLE,
      })
      .getMany();
  }
}
