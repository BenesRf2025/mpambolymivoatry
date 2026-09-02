// src/modules/iot/entities/iot-device.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('iot_devices')
export class IoTDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parcel_id', type: 'uuid' })
  parcelId: string;

  @Column({ name: 'device_code', type: 'varchar', unique: true })
  deviceCode: string;

  @Column({ name: 'device_type', type: 'varchar', default: 'SOIL_SENSOR' })
  deviceType: string;

  @Column({ name: 'firmware_version', type: 'varchar', nullable: true })
  firmwareVersion: string | null;

  @Column({ name: 'last_seen_at', type: 'timestamp', nullable: true })
  lastSeenAt: Date | null;

  @Column({ name: 'battery_level', type: 'float', nullable: true })
  batteryLevel: number | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
