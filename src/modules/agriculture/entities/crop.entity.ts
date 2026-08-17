// src/modules/agriculture/entities/crop.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Parcel } from './parcel.entity';
import { Harvest } from './harvest.entity';

@Entity('crops')
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parcel_id', type: 'uuid' })
  parcelId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  variety: string | null;

  @Column({ name: 'planting_date', type: 'date' })
  plantingDate: Date;

  @Column({ name: 'expected_harvest_date', type: 'date', nullable: true })
  expectedHarvestDate: Date | null;

  @Column({ type: 'varchar', default: 'EN_CROISSANCE' })
  status: string;

  @Column({ name: 'estimated_yield_kg', type: 'float', nullable: true })
  estimatedYieldKg: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Parcel, (parcel) => parcel.crops)
  @JoinColumn({ name: 'parcel_id' })
  parcel: Parcel;

  @OneToMany(() => Harvest, (harvest) => harvest.crop)
  harvests: Harvest[];

  // Calcul simple de la date de récolte prévue si pas définie explicitement
  calculateExpectedHarvest(growthDurationDays: number): Date {
    const date = new Date(this.plantingDate);
    date.setDate(date.getDate() + growthDurationDays);
    return date;
  }
}
