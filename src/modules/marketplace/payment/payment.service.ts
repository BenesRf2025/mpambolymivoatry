// src/modules/marketplace/payment/payment.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrderService } from '../order/order.service';
import { OrderStatus } from '../enums/order-status.enum';
import { SimulatedPaymentProvider } from './providers/simulated-payment.provider';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentRepo: Repository<PaymentTransaction>,
    private readonly orderService: OrderService,
    private readonly simulatedProvider: SimulatedPaymentProvider,
  ) {}

  async payOrder(
    orderId: string,
    provider: string,
  ): Promise<PaymentTransaction> {
    const order = await this.orderService.findOne(orderId);

    if (order.status !== OrderStatus.ACCEPTEE) {
      throw new BadRequestException(
        'La commande doit être acceptée par le vendeur avant paiement',
      );
    }

    // Pour le hackathon, tous les providers passent par la simulation
    const result = await this.simulatedProvider.processPayment(
      order.totalAmountAr,
      order.id,
    );

    const transaction = this.paymentRepo.create({
      orderId: order.id,
      provider,
      transactionReference: result.transactionReference,
      amountAr: order.totalAmountAr,
      status: result.success ? PaymentStatus.REUSSI : PaymentStatus.ECHEC,
      paidAt: result.success ? new Date() : null,
    });

    await this.paymentRepo.save(transaction);

    if (result.success) {
      await this.orderService.markAsPaid(order.id);
    }

    return transaction;
  }

  async findByOrder(orderId: string): Promise<PaymentTransaction[]> {
    return this.paymentRepo.find({ where: { orderId } });
  }
}
