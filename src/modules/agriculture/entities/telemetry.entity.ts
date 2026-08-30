// src/modules/agriculture/entities/telemetry.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sensor } from './sensor.entity';

@Entity('telemetries')
export class Telemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sensor_id', type: 'uuid' })
  sensorId: string;

  @Column({ name: 'soil_moisture', type: 'float' })
  soilMoisture: number;

  @Column({ name: 'battery', type: 'float', nullable: true })
  battery: number | null;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ name: 'soil_temperature', type: 'float', nullable: true })
  soilTemperature: number | null;

  @Column({ name: 'air_humidity', type: 'float', nullable: true })
  airHumidity: number | null;

  @Column({ name: 'rainfall_mm_per_hour', type: 'float', nullable: true })
  rainfallMmPerHour: number | null;

  @CreateDateColumn({ name: 'received_at' })
  receivedAt: Date;

  @ManyToOne(() => Sensor, (sensor) => sensor.telemetries)
  @JoinColumn({ name: 'sensor_id' })
  sensor: Sensor;
}
