// src/modules/iot/entities/sensor-reading.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sensor_readings')
export class SensorReading {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'device_id', type: 'uuid' })
  deviceId: string;

  @Column({ name: 'soil_humidity', type: 'float', nullable: true })
  soilHumidity: number | null;

  @Column({ type: 'float', nullable: true })
  temperature: number | null;

  @Column({ name: 'air_humidity', type: 'float', nullable: true })
  airHumidity: number | null;

  @Column({ type: 'float', nullable: true })
  rainfall: number | null;

  @Column({ name: 'water_level', type: 'float', nullable: true })
  waterLevel: number | null;

  @Column({ name: 'battery_voltage', type: 'float', nullable: true })
  batteryVoltage: number | null;

  @CreateDateColumn({ name: 'measured_at' })
  measuredAt: Date;
}
