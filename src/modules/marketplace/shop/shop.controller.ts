// src/modules/marketplace/shop/shop.controller.ts
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
import { ShopService } from './shop.service';
import { CreateShopDto } from '../dto/create-shop.dto';

@ApiTags('Marketplace - Shops')
@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les boutiques actives (public)' })
  findAll() {
    return this.shopService.findAllActive();
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une boutique avec ses produits" })
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Créer ma boutique' })
  create(@Request() req, @Body() dto: CreateShopDto) {
    return this.shopService.createForUser(req.user.userId, dto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('me/list')
  @ApiOperation({ summary: 'Lister mes boutiques' })
  findMine(@Request() req) {
    return this.shopService.findByOwner(req.user.userId);
  }
}
