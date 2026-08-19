// src/modules/marketplace/entities/order-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'quantity_kg', type: 'float' })
  quantityKg: number;

  @Column({ name: 'unit_price_ar', type: 'decimal', precision: 12, scale: 2 })
  unitPriceAr: number;

  @Column({ name: 'subtotal_ar', type: 'decimal', precision: 12, scale: 2 })
  subtotalAr: number;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
