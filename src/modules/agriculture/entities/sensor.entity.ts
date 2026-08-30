// src/modules/agriculture/entities/sensor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Telemetry } from './telemetry.entity';

@Entity('sensors')
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'plot_name', type: 'varchar', nullable: true })
  plotName: string | null;

  @Column({ type: 'varchar', default: 'unknown' })
  status: string;

  @Column({ name: 'battery_level', type: 'float', nullable: true })
  batteryLevel: number | null;

  @Column({ name: 'soil_moisture', type: 'float', nullable: true })
  soilMoisture: number | null;

  @Column({ name: 'soil_temperature', type: 'float', nullable: true })
  soilTemperature: number | null;

  @Column({ name: 'air_humidity', type: 'float', nullable: true })
  airHumidity: number | null;

  @Column({ name: 'rainfall_mm_per_hour', type: 'float', nullable: true })
  rainfallMmPerHour: number | null;

  @Column({ type: 'varchar', default: 'closed' })
  valveStatus: string;

  @Column({ name: 'auto_mode', type: 'boolean', default: true })
  autoMode: boolean;

  @Column({ name: 'last_transmission', type: 'timestamp', nullable: true })
  lastTransmission: Date | null;

  @Column({ name: 'sms_alerts_enabled', type: 'boolean', default: false })
  smsAlertsEnabled: boolean;

  @Column({ type: 'varchar', nullable: true })
  signalStrength: string | null;

  @Column({ type: 'float', nullable: true })
  latitude: number | null;

  @Column({ type: 'float', nullable: true })
  longitude: number | null;

  @Column({ name: 'recommended_action_fr', type: 'text', nullable: true })
  recommendedActionFr: string | null;

  @Column({ name: 'recommended_action_mg', type: 'text', nullable: true })
  recommendedActionMg: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Telemetry, (t) => t.sensor)
  telemetries: Telemetry[];
}
