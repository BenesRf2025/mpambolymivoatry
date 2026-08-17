// src/modules/agriculture/crop/crop.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crop } from '../entities/crop.entity';
import { CreateCropDto } from '../dto/create-crop.dto';
import { ParcelService } from '../parcel/parcel.service';

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepo: Repository<Crop>,
    private readonly parcelService: ParcelService,
  ) {}

  async create(userId: string, dto: CreateCropDto): Promise<Crop> {
    await this.parcelService.checkOwnership(dto.parcelId, userId);

    const crop = this.cropRepo.create({
      parcelId: dto.parcelId,
      name: dto.name,
      variety: dto.variety ?? null,
      plantingDate: new Date(dto.plantingDate),
      expectedHarvestDate: dto.expectedHarvestDate
        ? new Date(dto.expectedHarvestDate)
        : null,
      estimatedYieldKg: dto.estimatedYieldKg ?? null,
    });

    return this.cropRepo.save(crop);
  }

  async findByParcel(parcelId: string): Promise<Crop[]> {
    return this.cropRepo.find({
      where: { parcelId },
      relations: { harvests: true }, // 🔧
      order: { plantingDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepo.findOne({
      where: { id },
      relations: { harvests: true, parcel: true }, // 🔧
    });
    if (!crop) throw new NotFoundException('Culture introuvable');
    return crop;
  }
}
