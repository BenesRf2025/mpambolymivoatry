// src/modules/marketplace/marketplace.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shop } from './entities/shop.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { Harvest } from '../agriculture/entities/harvest.entity';

import { ShopService } from './shop/shop.service';
import { ShopController } from './shop/shop.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { ProductCatalogController } from './product/product-catalog.controller';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { SimulatedPaymentProvider } from './payment/providers/simulated-payment.provider';

import { AssociationModule } from '../association/association.module'; // 🆕

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shop,
      Product,
      Order,
      OrderItem,
      PaymentTransaction,
      Harvest,
    ]),
    AssociationModule, // 🆕
  ],
  controllers: [
    ShopController,
    ProductController,
    ProductCatalogController,
    OrderController,
    PaymentController,
  ],
  providers: [
    ShopService,
    ProductService,
    OrderService,
    PaymentService,
    SimulatedPaymentProvider,
  ],
  exports: [ShopService, ProductService, OrderService],
})
export class MarketplaceModule {}
