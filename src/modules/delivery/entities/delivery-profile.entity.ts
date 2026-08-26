// src/modules/delivery/entities/delivery-profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { VehicleType } from '../enums/vehicle-type.enum';

@Entity('delivery_profiles')
export class DeliveryProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({ name: 'vehicle_type', type: 'enum', enum: VehicleType })
  vehicleType: VehicleType;

  @Column({ type: 'boolean', default: false })
  available: boolean;

  @Column({ name: 'current_latitude', type: 'float', nullable: true })
  currentLatitude: number | null;

  @Column({ name: 'current_longitude', type: 'float', nullable: true })
  currentLongitude: number | null;

  @Column({ name: 'max_distance_km', type: 'float' })
  maxDistanceKm: number;

  @Column({ name: 'last_location_update', type: 'timestamp', nullable: true })
  lastLocationUpdate: Date | null;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ name: 'total_deliveries', type: 'int', default: 0 })
  totalDeliveries: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
