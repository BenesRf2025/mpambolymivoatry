// src/modules/iot/entities/irrigation-configuration.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { IrrigationMode } from '../enums/irrigation-mode.enum';

@Entity('irrigation_configurations')
export class IrrigationConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parcel_id', type: 'uuid', unique: true })
  parcelId: string;

  @Column({ name: 'minimum_humidity', type: 'float', default: 30 })
  minimumHumidity: number;

  @Column({ name: 'maximum_humidity', type: 'float', default: 80 })
  maximumHumidity: number;

  @Column({ name: 'duration_seconds', type: 'int', default: 300 })
  durationSeconds: number;

  @Column({
    type: 'enum',
    enum: IrrigationMode,
    default: IrrigationMode.MANUEL,
  })
  mode: IrrigationMode;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
