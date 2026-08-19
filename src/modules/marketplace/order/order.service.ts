// src/modules/marketplace/order/order.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { randomUUID } from 'crypto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { Shop } from '../entities/shop.entity'; // 🆕
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Shop) // 🆕
    private readonly shopRepo: Repository<Shop>,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  async create(buyerUserId: string, dto: CreateOrderDto): Promise<Order> {
    const productIds = dto.items.map((i) => i.productId);

    const products = await this.productRepo.findBy({
      id: In(productIds),
    });

    if (products.length !== dto.items.length) {
      throw new NotFoundException('Un ou plusieurs produits sont introuvables');
    }

    const wrongShop = products.find((p) => p.shopId !== dto.shopId);
    if (wrongShop) {
      throw new BadRequestException(
        `Le produit "${wrongShop.name}" n'appartient pas à la boutique sélectionnée. Une commande ne peut concerner qu'un seul vendeur.`,
      );
    }

    // 🆕 Vérification anti-auto-achat
    const shop = await this.shopRepo.findOne({ where: { id: dto.shopId } });
    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }
    if (shop.ownerUserId === buyerUserId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas acheter vos propres produits',
      );
    }

    const items: OrderItem[] = [];
    let totalAmountAr = 0;

    for (const inputItem of dto.items) {
      const product = products.find((p) => p.id === inputItem.productId)!;

      if (!product.available || product.quantityKg < inputItem.quantityKg) {
        throw new BadRequestException(
          `Stock insuffisant pour "${product.name}" (disponible: ${product.quantityKg} ${product.unit})`,
        );
      }

      const subtotal = Number(product.priceAr) * inputItem.quantityKg;
      totalAmountAr += subtotal;

      const item = new OrderItem();
      item.productId = product.id;
      item.quantityKg = inputItem.quantityKg;
      item.unitPriceAr = product.priceAr;
      item.subtotalAr = subtotal;
      items.push(item);
    }

    const order = this.orderRepo.create({
      reference: `ORD-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
      buyerUserId,
      shopId: dto.shopId,
      deliveryAddress: dto.deliveryAddress,
      status: OrderStatus.ENVOYEE,
      totalAmountAr,
      items,
    });

    return this.orderRepo.save(order);
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

  async findByBuyer(buyerUserId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { buyerUserId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByShop(shopId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { shopId },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  // 🆕 Vérifie que c'est bien le propriétaire de la boutique qui accepte/refuse
  private async checkShopOwnership(
    shopId: string,
    userId: string,
  ): Promise<void> {
    const shop = await this.shopRepo.findOne({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Boutique introuvable');
    if (shop.ownerUserId !== userId) {
      throw new ForbiddenException(
        "Vous n'êtes pas propriétaire de cette boutique",
      );
    }
  }

  async accept(orderId: string, userId: string): Promise<Order> {
    const order = await this.findOne(orderId);
    await this.checkShopOwnership(order.shopId, userId); // 🆕 vérification réelle

    if (order.status !== OrderStatus.ENVOYEE) {
      throw new BadRequestException(
        `Impossible d'accepter une commande au statut ${order.status}`,
      );
    }

    order.status = OrderStatus.ACCEPTEE;
    order.acceptedAt = new Date();
    return this.orderRepo.save(order);
  }

  async refuse(orderId: string, userId: string): Promise<Order> {
    const order = await this.findOne(orderId);
    await this.checkShopOwnership(order.shopId, userId); // 🆕 vérification réelle

    if (order.status !== OrderStatus.ENVOYEE) {
      throw new BadRequestException(
        `Impossible de refuser une commande au statut ${order.status}`,
      );
    }

    order.status = OrderStatus.REFUSEE;
    return this.orderRepo.save(order);
  }

  async markAsPaid(orderId: string): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.status !== OrderStatus.ACCEPTEE) {
      throw new BadRequestException(
        'La commande doit être acceptée par le vendeur avant paiement',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      for (const item of order.items) {
        await this.productService.decrementStock(
          item.productId,
          item.quantityKg,
        );
      }

      order.status = OrderStatus.PAYEE;
      return manager.save(order);
    });
  }

  async updateStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.findOne(orderId);
    order.status = newStatus;

    if (newStatus === OrderStatus.LIVREE) {
      order.deliveredAt = new Date();
    }

    return this.orderRepo.save(order);
  }
}
