// src/modules/family/entities/activity-trace.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ActivityActionType {
  IRRIGATION = 'IRRIGATION',
  INSPECTION = 'INSPECTION',
  SALE = 'SALE',
  CROP_CREATE = 'CROP_CREATE',
  CROP_UPDATE = 'CROP_UPDATE',
  HARVEST = 'HARVEST',
  LISTING_CREATE = 'LISTING_CREATE',
  SENSOR_UPDATE = 'SENSOR_UPDATE',
}

@Entity('activity_traces')
export class ActivityTrace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'family_id', type: 'uuid' })
  familyId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'user_name', type: 'varchar' })
  userName: string;

  @Column({
    name: 'action_type',
    type: 'enum',
    enum: ActivityActionType,
  })
  actionType: ActivityActionType;

  @Column({ name: 'entity_type', type: 'varchar' })
  entityType: string;

  @Column({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @Column({ name: 'details', type: 'jsonb', nullable: true })
  details: Record<string, any> | null;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
