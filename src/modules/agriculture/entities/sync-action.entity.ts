// src/modules/agriculture/entities/sync-action.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sync_actions')
export class SyncAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ name: 'client_id', type: 'varchar' })
  clientId: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ name: 'applied', type: 'boolean', default: false })
  applied: boolean;

  @Column({ type: 'text', nullable: true })
  error: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
