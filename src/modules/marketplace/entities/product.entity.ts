// src/modules/marketplace/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shop } from './shop.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'shop_id', type: 'uuid' })
  shopId: string;

  @Column({ name: 'source_harvest_id', type: 'uuid', nullable: true })
  sourceHarvestId: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  category: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'price_ar', type: 'decimal', precision: 12, scale: 2 })
  priceAr: number;

  @Column({ name: 'quantity_kg', type: 'float' })
  quantityKg: number;

  @Column({ type: 'varchar', default: 'kg' })
  unit: string;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Shop, (shop) => shop.products)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;
}
