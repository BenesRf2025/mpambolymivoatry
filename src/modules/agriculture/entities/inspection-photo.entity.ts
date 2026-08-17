// src/modules/agriculture/entities/inspection-photo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inspection } from './inspection.entity';

@Entity('inspection_photos')
export class InspectionPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'inspection_id', type: 'uuid' })
  inspectionId: string;

  @Column({ name: 'file_url', type: 'varchar' })
  fileUrl: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Inspection, (inspection) => inspection.photos)
  @JoinColumn({ name: 'inspection_id' })
  inspection: Inspection;
}
