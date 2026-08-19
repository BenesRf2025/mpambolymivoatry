// src/modules/marketplace/entities/payment-transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar' })
  provider: string; // 'MVOLA', 'ORANGE_MONEY', 'SIMULATED'

  @Column({ name: 'transaction_reference', type: 'varchar', unique: true })
  transactionReference: string;

  @Column({ name: 'amount_ar', type: 'decimal', precision: 12, scale: 2 })
  amountAr: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.EN_ATTENTE,
  })
  status: PaymentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null;
}
