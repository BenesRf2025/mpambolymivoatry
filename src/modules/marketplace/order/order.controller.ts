// src/modules/marketplace/order/order.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@ApiTags('Marketplace - Orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Passer une commande (acheteur)' })
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.userId, dto);
  }

  @Get('my-purchases')
  @ApiOperation({ summary: 'Mes commandes en tant qu’acheteur' })
  findMyPurchases(@Request() req) {
    return this.orderService.findByBuyer(req.user.userId);
  }

  @Get('shop/:shopId')
  @ApiOperation({ summary: 'Commandes reçues pour ma boutique (vendeur)' })
  findByShop(@Param('shopId') shopId: string) {
    return this.orderService.findByShop(shopId);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une commande" })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accepter la commande (vendeur)' })
  accept(@Request() req, @Param('id') id: string) {
    return this.orderService.accept(id, req.user.userId); // 🔧 déjà correct normalement
  }

  @Patch(':id/refuse')
  @ApiOperation({ summary: 'Refuser la commande (vendeur)' })
  refuse(@Request() req, @Param('id') id: string) {
    // 🔧 ajout de @Request() req
    return this.orderService.refuse(id, req.user.userId); // 🔧 passage du userId
  }
}
