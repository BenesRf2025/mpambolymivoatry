// src/modules/marketplace/product/product-catalog.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('Marketplace - Catalog')
@Controller('products')
export class ProductCatalogController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Catalogue public - tous les produits disponibles' })
  findAllAvailable() {
    return this.productService.findAllAvailable();
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'un produit" })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}
