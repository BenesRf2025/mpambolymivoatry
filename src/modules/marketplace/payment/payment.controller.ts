// src/modules/marketplace/payment/payment.controller.ts
import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { PayOrderDto } from '../dto/pay-order.dto';

@ApiTags('Marketplace - Payment')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Payer une commande (simulé pour la démo)' })
  pay(@Param('orderId') orderId: string, @Body() dto: PayOrderDto) {
    return this.paymentService.payOrder(orderId, dto.provider);
  }
}
