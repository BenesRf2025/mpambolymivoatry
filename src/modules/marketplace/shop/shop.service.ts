// src/modules/marketplace/shop/shop.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { CreateShopDto } from '../dto/create-shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  async createForUser(userId: string, dto: CreateShopDto): Promise<Shop> {
    const shop = this.shopRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      address: dto.address ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      ownerUserId: userId,
      ownerAssociationId: null,
    });
    return this.shopRepo.save(shop);
  }

  async findAllActive(): Promise<Shop[]> {
    return this.shopRepo.find({
      where: { active: true },
      relations: { products: true },
    });
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopRepo.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    return shop;
  }

  async findByOwner(userId: string): Promise<Shop[]> {
    return this.shopRepo.find({
      where: { ownerUserId: userId },
      relations: { products: true },
    });
  }

  async checkOwnership(shopId: string, userId: string): Promise<Shop> {
    const shop = await this.findOne(shopId);
    if (shop.ownerUserId !== userId) {
      throw new ForbiddenException(
        "Vous n'êtes pas propriétaire de cette boutique",
      );
    }
    return shop;
  }
  // src/modules/marketplace/shop/shop.service.ts — méthode à ajouter

  async createForAssociation(
    associationId: string,
    dto: CreateShopDto,
  ): Promise<Shop> {
    const shop = this.shopRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      address: dto.address ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      ownerUserId: null,
      ownerAssociationId: associationId,
    });
    return this.shopRepo.save(shop);
  }
}
