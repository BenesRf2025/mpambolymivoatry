// src/modules/family/entities/family.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { FamilyMember } from './family-member.entity';
import { FamilyToken } from './family-token.entity';
import { ActivityTrace } from './activity-trace.entity';

@Entity('families')
export class Family {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'head_user_id', type: 'uuid', nullable: true })
  headUserId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => FamilyMember, (member) => member.family)
  members: FamilyMember[];

  @OneToMany(() => FamilyToken, (token) => token.family)
  tokens: FamilyToken[];

  @OneToMany(() => ActivityTrace, (trace) => trace.familyId)
  activityTraces: ActivityTrace[];
}
