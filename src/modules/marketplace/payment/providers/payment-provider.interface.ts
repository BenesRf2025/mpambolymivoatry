// src/modules/marketplace/payment/providers/payment-provider.interface.ts
export interface PaymentResult {
  success: boolean;
  transactionReference: string;
}

export interface PaymentProvider {
  processPayment(amountAr: number, orderId: string): Promise<PaymentResult>;
}
