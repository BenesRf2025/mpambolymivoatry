// src/modules/marketplace/payment/providers/simulated-payment.provider.ts
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentProvider, PaymentResult } from './payment-provider.interface';

@Injectable()
export class SimulatedPaymentProvider implements PaymentProvider {
  /**
   * Simule un paiement pour la démo hackathon.
   * Toujours réussi (utile pour les démos fiables).
   * À remplacer plus tard par une vraie intégration MVola/Orange Money
   * en implémentant la même interface PaymentProvider.
   */
  async processPayment(
    amountAr: number,
    orderId: string,
  ): Promise<PaymentResult> {
    // Simule un léger délai réseau
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      transactionReference: `SIM-${orderId.slice(0, 8)}-${randomUUID().slice(0, 8)}`,
    };
  }
}
