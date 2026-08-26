// src/modules/delivery/entities/delivery.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { DeliveryStatus } from '../enums/delivery-status.enum';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid', unique: true })
  orderId: string;

  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: string;

  @Column({ name: 'driver_id', type: 'uuid', nullable: true })
  driverId: string | null;

  @Column({ name: 'pickup_latitude', type: 'float', nullable: true })
  pickupLatitude: number | null;

  @Column({ name: 'pickup_longitude', type: 'float', nullable: true })
  pickupLongitude: number | null;

  @Column({ name: 'delivery_address', type: 'varchar' })
  deliveryAddress: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.EN_ATTENTE_LIVREUR,
  })
  status: DeliveryStatus;

  @Column({ name: 'assigned_at', type: 'timestamp', nullable: true })
  assignedAt: Date | null;

  @Column({ name: 'picked_up_at', type: 'timestamp', nullable: true })
  pickedUpAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date | null;

  @Column({ name: 'proof_photo_url', type: 'varchar', nullable: true })
  proofPhotoUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
