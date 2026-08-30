// src/modules/agriculture/listings/listings.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListingsService } from './listings.service';
import { CreateListingDto } from '../dto/create-listing.dto';

@ApiTags('Listings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les annonces' })
  @ApiResponse({ status: 200, description: 'Liste des annonces' })
  findAll() {
    return this.listingsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle annonce' })
  @ApiResponse({ status: 201, description: 'Annonce créée' })
  create(@Request() req, @Body() dto: CreateListingDto) {
    return this.listingsService.create(req.user.userId, dto);
  }
}
