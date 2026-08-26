// src/modules/association/entities/association.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { AssociationType } from '../enums/association-type.enum';
import { AssociationMember } from './association-member.entity';

@Entity('associations')
export class Association {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: AssociationType })
  type: AssociationType;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true })
  location: string | null;

  @Column({ name: 'registration_number', type: 'varchar', nullable: true })
  registrationNumber: string | null;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => AssociationMember, (member) => member.association)
  members: AssociationMember[];

  // Règle métier : accès aux commandes en gros / marchés institutionnels
  canAccessBulkOrders(): boolean {
    return (
      (this.type === AssociationType.COOPERATIVE ||
        this.type === AssociationType.ENTREPRISE) &&
      this.verified
    );
  }
}
