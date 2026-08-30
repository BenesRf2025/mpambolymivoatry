// src/modules/delivery/delivery/delivery.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '../entities/delivery.entity';
import { DeliveryStatus } from '../enums/delivery-status.enum';
import { DeliveryProfileService } from '../delivery-profile/delivery-profile.service';
import { GeoService } from '../geo/geo.service';
import { CompleteDeliveryDto } from '../dto/complete-delivery.dto';
import { OrderService } from '../../marketplace/order/order.service';
import { OrderStatus } from '../../marketplace/enums/order-status.enum';

const RADIUS_STEP_KM = 5;
const MAX_RADIUS_KM = 50;

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
    private readonly profileService: DeliveryProfileService,
    private readonly geoService: GeoService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async createForOrder(
    orderId: string,
    shopId: string,
    pickupLatitude: number | null,
    pickupLongitude: number | null,
    deliveryAddress: string,
  ): Promise<Delivery> {
    const delivery = this.deliveryRepo.create({
      orderId,
      shopId,
      pickupLatitude,
      pickupLongitude,
      deliveryAddress,
      status: DeliveryStatus.EN_ATTENTE_LIVREUR,
    });
    return this.deliveryRepo.save(delivery);
  }

  async findNearbyForDriver(userId: string): Promise<{
    deliveries: Array<Delivery & { distanceKm: number }>;
    radiusUsed: number;
    wasExpanded: boolean;
  }> {
    const profile = await this.profileService.findByUser(userId);

    if (!profile.available) {
      throw new BadRequestException(
        'Activez votre disponibilité pour voir les livraisons',
      );
    }
    if (profile.currentLatitude === null || profile.currentLongitude === null) {
      throw new BadRequestException(
        'Mettez à jour votre position pour voir les livraisons proches',
      );
    }

    const pendingDeliveries = await this.deliveryRepo.find({
      where: { status: DeliveryStatus.EN_ATTENTE_LIVREUR },
    });

    let currentRadius = profile.maxDistanceKm;
    let matched: Array<Delivery & { distanceKm: number }> = [];

    while (currentRadius <= MAX_RADIUS_KM) {
      matched = pendingDeliveries
        .filter((d) => d.pickupLatitude !== null && d.pickupLongitude !== null)
        .map((d) => ({
          ...d,
          distanceKm: this.geoService.calculateDistanceKm(
            profile.currentLatitude!,
            profile.currentLongitude!,
            d.pickupLatitude!,
            d.pickupLongitude!,
          ),
        }))
        .filter((d) => d.distanceKm <= currentRadius)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      if (matched.length > 0) break;
      currentRadius += RADIUS_STEP_KM;
    }

    return {
      deliveries: matched,
      radiusUsed: currentRadius,
      wasExpanded: currentRadius > profile.maxDistanceKm,
    };
  }

  async accept(deliveryId: string, driverId: string): Promise<Delivery> {
    const delivery = await this.findOne(deliveryId);

    if (delivery.status !== DeliveryStatus.EN_ATTENTE_LIVREUR) {
      throw new BadRequestException("Cette livraison n'est plus disponible");
    }

    const result = await this.deliveryRepo
      .createQueryBuilder()
      .update(Delivery)
      .set({
        driverId,
        status: DeliveryStatus.ACCEPTEE,
        assignedAt: new Date(),
      })
      .where('id = :id AND driverId IS NULL', { id: deliveryId })
      .execute();

    if (result.affected === 0) {
      throw new ConflictException(
        "Cette livraison vient d'être acceptée par un autre livreur",
      );
    }

    return this.findOne(deliveryId);
  }

  async markPickedUp(deliveryId: string, driverId: string): Promise<Delivery> {
    const delivery = await this.checkDriverOwnership(deliveryId, driverId);

    if (delivery.status !== DeliveryStatus.ACCEPTEE) {
      throw new BadRequestException(
        `Impossible de marquer "récupéré" depuis le statut ${delivery.status}`,
      );
    }

    delivery.status = DeliveryStatus.EN_COURS;
    delivery.pickedUpAt = new Date();
    const saved = await this.deliveryRepo.save(delivery);

    await this.orderService.updateStatus(
      delivery.orderId,
      OrderStatus.EN_LIVRAISON,
    );

    return saved;
  }

  async markDelivered(
    deliveryId: string,
    driverId: string,
    dto: CompleteDeliveryDto,
  ): Promise<Delivery> {
    const delivery = await this.checkDriverOwnership(deliveryId, driverId);

    if (delivery.status !== DeliveryStatus.EN_COURS) {
      throw new BadRequestException(
        `Impossible de confirmer la livraison depuis le statut ${delivery.status}`,
      );
    }

    delivery.status = DeliveryStatus.LIVREE;
    delivery.deliveredAt = new Date();
    delivery.proofPhotoUrl = dto.proofPhotoUrl ?? null;
    const saved = await this.deliveryRepo.save(delivery);

    await this.orderService.updateStatus(delivery.orderId, OrderStatus.LIVREE);
    await this.profileService.incrementDeliveryCount(driverId);

    return saved;
  }

  async markFailed(deliveryId: string, driverId: string): Promise<Delivery> {
    const delivery = await this.checkDriverOwnership(deliveryId, driverId);

    delivery.driverId = null;
    delivery.status = DeliveryStatus.EN_ATTENTE_LIVREUR;

    return this.deliveryRepo.save(delivery);
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({ where: { id } });
    if (!delivery) throw new NotFoundException('Livraison introuvable');
    return delivery;
  }

  async findByOrder(orderId: string): Promise<Delivery | null> {
    return this.deliveryRepo.findOne({ where: { orderId } });
  }

  async findMyDeliveries(driverId: string): Promise<Delivery[]> {
    return this.deliveryRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
    });
  }

  private async checkDriverOwnership(
    deliveryId: string,
    driverId: string,
  ): Promise<Delivery> {
    const delivery = await this.findOne(deliveryId);
    if (delivery.driverId !== driverId) {
      throw new ForbiddenException('Cette livraison ne vous est pas assignée');
    }
    return delivery;
  }
}
