// src/modules/agriculture/listings/listings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { CreateListingDto } from '../dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
  ) {}

  async findAll(): Promise<Listing[]> {
    return this.listingRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: string, dto: CreateListingDto): Promise<Listing> {
    const listing = this.listingRepo.create({
      sellerUserId: userId,
      sellerType: dto.sellerType ?? null,
      name: dto.name,
      description: dto.description ?? null,
      unit: dto.unit ?? null,
      quantity: dto.quantity ?? null,
      price: dto.price ?? null,
      images: dto.images ?? null,
    });
    return this.listingRepo.save(listing);
  }
}
