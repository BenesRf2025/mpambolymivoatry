// src/modules/agriculture/entities/parcel.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Crop } from './crop.entity';
import { Inspection } from './inspection.entity';

@Entity('parcels')
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'area_m2', type: 'float' })
  areaM2: number;

  @Column({ type: 'float', nullable: true })
  latitude: number | null;

  @Column({ type: 'float', nullable: true })
  longitude: number | null;

  @Column({ name: 'soil_type', type: 'varchar', nullable: true })
  soilType: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Crop, (crop) => crop.parcel)
  crops: Crop[];

  @OneToMany(() => Inspection, (inspection) => inspection.parcel)
  inspections: Inspection[];
}
