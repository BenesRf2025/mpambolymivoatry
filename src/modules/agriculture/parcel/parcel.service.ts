// src/modules/agriculture/parcel/parcel.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from '../entities/parcel.entity';
import { CreateParcelDto } from '../dto/create-parcel.dto';

@Injectable()
export class ParcelService {
  constructor(
    @InjectRepository(Parcel)
    private readonly parcelRepo: Repository<Parcel>,
  ) {}

  async create(userId: string, dto: CreateParcelDto): Promise<Parcel> {
    const parcel = this.parcelRepo.create({
      ownerUserId: userId,
      name: dto.name,
      areaM2: dto.areaM2,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      soilType: dto.soilType ?? null,
    });
    return this.parcelRepo.save(parcel);
  }

  async findAllByUser(userId: string): Promise<Parcel[]> {
    return this.parcelRepo.find({
      where: { ownerUserId: userId },
      relations: { crops: true }, // 🔧
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Parcel> {
    const parcel = await this.parcelRepo.findOne({
      where: { id },
      relations: { crops: { harvests: true } }, // 🔧
    });
    if (!parcel) throw new NotFoundException('Parcelle introuvable');
    return parcel;
  }

  async checkOwnership(parcelId: string, userId: string): Promise<Parcel> {
    const parcel = await this.findOne(parcelId);
    if (parcel.ownerUserId !== userId) {
      throw new ForbiddenException(
        "Vous n'êtes pas propriétaire de cette parcelle",
      );
    }
    return parcel;
  }
}
