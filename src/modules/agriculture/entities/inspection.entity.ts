// src/modules/agriculture/entities/inspection.entity.ts
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
import { InspectionPhoto } from './inspection-photo.entity';
import { InspectionStatus } from '../enums/inspection-status.enum';

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parcel_id', type: 'uuid' })
  parcelId: string;

  @Column({ name: 'inspector_user_id', type: 'uuid' })
  inspectorUserId: string;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.PLANIFIEE,
  })
  status: InspectionStatus;

  @Column({ type: 'text', nullable: true })
  observation: string | null;

  @Column({ name: 'voice_note_url', type: 'varchar', nullable: true })
  voiceNoteUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @ManyToOne(() => Parcel, (parcel) => parcel.inspections)
  @JoinColumn({ name: 'parcel_id' })
  parcel: Parcel;

  @OneToMany(() => InspectionPhoto, (photo) => photo.inspection)
  photos: InspectionPhoto[];
}
