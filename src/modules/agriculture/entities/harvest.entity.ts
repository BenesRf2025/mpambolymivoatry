// src/modules/agriculture/entities/harvest.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Crop } from './crop.entity';
import { HarvestStatus } from '../enums/harvest-status.enum';

@Entity('harvests')
export class Harvest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'crop_id', type: 'uuid' })
  cropId: string;

  @Column({ name: 'harvested_at', type: 'timestamp' })
  harvestedAt: Date;

  @Column({ name: 'quantity_kg', type: 'float' })
  quantityKg: number;

  @Column({ name: 'quality_grade', type: 'varchar', default: 'B' })
  qualityGrade: string; // A, B, C

  @Column({
    type: 'enum',
    enum: HarvestStatus,
    default: HarvestStatus.DISPONIBLE,
  })
  status: HarvestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Crop, (crop) => crop.harvests)
  @JoinColumn({ name: 'crop_id' })
  crop: Crop;
}
