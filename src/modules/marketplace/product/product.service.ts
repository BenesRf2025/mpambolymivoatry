// src/modules/marketplace/product/product.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { ShopService } from '../shop/shop.service';
import { Harvest } from '../../agriculture/entities/harvest.entity';
import { HarvestStatus } from '../../agriculture/enums/harvest-status.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Harvest)
    private readonly harvestRepo: Repository<Harvest>,
    private readonly shopService: ShopService,
  ) {}

  async create(
    userId: string,
    shopId: string,
    dto: CreateProductDto,
  ): Promise<Product> {
    // Vérifie que l'utilisateur possède bien cette boutique
    await this.shopService.checkOwnership(shopId, userId);

    // Si le produit provient d'une récolte, vérifier et décrémenter le stock
    if (dto.sourceHarvestId) {
      const harvest = await this.harvestRepo.findOne({
        where: { id: dto.sourceHarvestId },
      });
      if (!harvest) {
        throw new NotFoundException('Récolte source introuvable');
      }
      if (harvest.status !== HarvestStatus.DISPONIBLE) {
        throw new BadRequestException("Cette récolte n'est plus disponible");
      }

      // Calcule déjà utilisé sur cette récolte (somme des produits existants)
      const alreadyListed = await this.productRepo
        .createQueryBuilder('product')
        .where('product.sourceHarvestId = :harvestId', {
          harvestId: dto.sourceHarvestId,
        })
        .select('COALESCE(SUM(product.quantityKg), 0)', 'total')
        .getRawOne();

      const totalAlreadyListed = parseFloat(alreadyListed.total);
      const remaining = harvest.quantityKg - totalAlreadyListed;

      if (dto.quantityKg > remaining) {
        throw new BadRequestException(
          `Quantité demandée (${dto.quantityKg} kg) supérieure au stock disponible de la récolte (${remaining} kg restants)`,
        );
      }

      // Si tout le stock de la récolte est maintenant utilisé → marquer VENDU
      if (dto.quantityKg === remaining) {
        harvest.status = HarvestStatus.VENDU;
        await this.harvestRepo.save(harvest);
      } else {
        harvest.status = HarvestStatus.RESERVE;
        await this.harvestRepo.save(harvest);
      }
    }

    const product = this.productRepo.create({
      shopId,
      sourceHarvestId: dto.sourceHarvestId ?? null,
      name: dto.name,
      category: dto.category ?? null,
      description: dto.description ?? null,
      priceAr: dto.priceAr,
      quantityKg: dto.quantityKg,
      unit: dto.unit ?? 'kg',
      available: true,
    });

    return this.productRepo.save(product);
  }

  async findAllAvailable(): Promise<Product[]> {
    return this.productRepo.find({
      where: { available: true },
      relations: { shop: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByShop(shopId: string): Promise<Product[]> {
    return this.productRepo.find({ where: { shopId } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { shop: true },
    });
    if (!product) throw new NotFoundException('Produit introuvable');
    return product;
  }

  // Utilisé en interne par OrderService pour décrémenter après commande
  async decrementStock(productId: string, quantityKg: number): Promise<void> {
    const product = await this.findOne(productId);
    if (product.quantityKg < quantityKg) {
      throw new BadRequestException(
        `Stock insuffisant pour ${product.name} (disponible: ${product.quantityKg} kg)`,
      );
    }
    product.quantityKg -= quantityKg;
    if (product.quantityKg === 0) {
      product.available = false;
    }
    await this.productRepo.save(product);
  }
}
