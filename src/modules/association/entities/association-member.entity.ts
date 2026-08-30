// src/modules/association/entities/association-member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Association } from './association.entity';
import { AssociationMemberRole } from '../enums/association-member-role.enum';
import { AssociationMemberStatus } from '../enums/association-member-status.enum';

@Entity('association_members')
@Unique(['associationId', 'userId']) // un user ne peut rejoindre 2x la même asso
export class AssociationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'association_id', type: 'uuid' })
  associationId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({
    name: 'member_role',
    type: 'enum',
    enum: AssociationMemberRole,
    default: AssociationMemberRole.MEMBRE,
  })
  memberRole: AssociationMemberRole;

  @Column({
    name: 'status',
    type: 'enum',
    enum: AssociationMemberStatus,
    default: AssociationMemberStatus.PENDING,
  })
  status: AssociationMemberStatus;

  @Column({
    name: 'revenue_percentage',
    type: 'float',
    default: 0,
  })
  revenuePercentage: number;

  @CreateDateColumn({ name: 'requested_at' })
  requestedAt: Date;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @ManyToOne(() => Association, (association) => association.members)
  @JoinColumn({ name: 'association_id' })
  association: Association;
}
