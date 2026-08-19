// src/modules/marketplace/entities/order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  reference: string;

  @Column({ name: 'buyer_user_id', type: 'uuid' })
  buyerUserId: string;

  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.BROUILLON,
  })
  status: OrderStatus;

  @Column({
    name: 'total_amount_ar',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  totalAmountAr: number;

  @Column({ name: 'delivery_address', type: 'varchar' })
  deliveryAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  // Recalcule le total à partir des items (utilisé côté service)
  calculateTotal(): number {
    return this.items?.reduce((sum, item) => sum + item.subtotalAr, 0) ?? 0;
  }
}
