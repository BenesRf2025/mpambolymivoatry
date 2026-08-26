// src/modules/delivery/delivery-profile/delivery-profile.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryProfile } from '../entities/delivery-profile.entity';
import { CreateDeliveryProfileDto } from '../dto/create-delivery-profile.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { DEFAULT_RADIUS_BY_VEHICLE } from '../enums/vehicle-type.enum';

@Injectable()
export class DeliveryProfileService {
  constructor(
    @InjectRepository(DeliveryProfile)
    private readonly profileRepo: Repository<DeliveryProfile>,
  ) {}

  async create(
    userId: string,
    dto: CreateDeliveryProfileDto,
  ): Promise<DeliveryProfile> {
    const existing = await this.profileRepo.findOne({ where: { userId } });
    if (existing) {
      throw new ConflictException('Profil livreur déjà existant');
    }

    const profile = this.profileRepo.create({
      userId,
      vehicleType: dto.vehicleType,
      maxDistanceKm:
        dto.maxDistanceKm ?? DEFAULT_RADIUS_BY_VEHICLE[dto.vehicleType],
      available: false,
    });

    return this.profileRepo.save(profile);
  }

  async findByUser(userId: string): Promise<DeliveryProfile> {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException(
        "Profil livreur introuvable. Créez-en un d'abord.",
      );
    }
    return profile;
  }

  async setAvailability(
    userId: string,
    available: boolean,
  ): Promise<DeliveryProfile> {
    const profile = await this.findByUser(userId);
    profile.available = available;
    return this.profileRepo.save(profile);
  }

  async updateLocation(
    userId: string,
    dto: UpdateLocationDto,
  ): Promise<DeliveryProfile> {
    const profile = await this.findByUser(userId);
    profile.currentLatitude = dto.latitude;
    profile.currentLongitude = dto.longitude;
    profile.lastLocationUpdate = new Date();
    return this.profileRepo.save(profile);
  }

  async incrementDeliveryCount(userId: string): Promise<void> {
    await this.profileRepo.increment({ userId }, 'totalDeliveries', 1);
  }
}
