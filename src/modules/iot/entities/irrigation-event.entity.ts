// src/modules/iot/entities/irrigation-event.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('irrigation_events')
export class IrrigationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parcel_id', type: 'uuid' })
  parcelId: string;

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({ name: 'duration_seconds', type: 'int', nullable: true })
  durationSeconds: number | null;

  @Column({ name: 'trigger_source', type: 'varchar' })
  triggerSource: string; // 'AUTO_SENSOR', 'MANUAL'

  @Column({ name: 'water_volume_liter', type: 'float', nullable: true })
  waterVolumeLiter: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
