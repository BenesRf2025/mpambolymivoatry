// src/modules/agriculture/entities/listing.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'seller_user_id', type: 'uuid' })
  sellerUserId: string;

  @Column({ name: 'seller_type', type: 'varchar', nullable: true })
  sellerType: string | null;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  unit: string | null;

  @Column({ name: 'quantity', type: 'float', nullable: true })
  quantity: number | null;

  @Column({ type: 'float', nullable: true })
  price: number | null;

  @Column({ type: 'simple-array', nullable: true })
  images: string[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
