// src/modules/marketplace/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from '../dto/create-product.dto';

@ApiTags('Marketplace - Products')
@Controller('shops/:shopId/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: "Lister les produits d'une boutique" })
  findByShop(@Param('shopId') shopId: string) {
    return this.productService.findByShop(shopId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Ajouter un produit à ma boutique' })
  create(
    @Request() req,
    @Param('shopId') shopId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(req.user.userId, shopId, dto);
  }
}
