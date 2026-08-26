// src/modules/marketplace/shop/shop.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ShopService } from './shop.service';
import { CreateShopDto } from '../dto/create-shop.dto';
import { AssociationService } from '../../association/association.service'; // 🆕
import { UpdateShopDto } from '../dto/update-shop.dto';

@ApiTags('Marketplace - Shops')
@Controller('shops')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly associationService: AssociationService, // 🆕
  ) {}

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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('association/:associationId')
  @ApiOperation({
    summary: 'Créer la boutique collective (gestionnaire uniquement)',
  })
  async createForAssociation(
    @Request() req,
    @Param('associationId') associationId: string,
    @Body() dto: CreateShopDto,
  ) {
    const isManager = await this.associationService.isGestionnaire(
      associationId,
      req.user.userId,
    );
    if (!isManager) {
      throw new ForbiddenException(
        'Seul un gestionnaire peut créer la boutique collective',
      );
    }
    return this.shopService.createForAssociation(associationId, dto);
  }
  // Ajout dans shop.controller.ts
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier ma boutique (ex: ajouter coordonnées GPS)',
  })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateShopDto) {
    return this.shopService.update(id, req.user.userId, dto);
  }
}
