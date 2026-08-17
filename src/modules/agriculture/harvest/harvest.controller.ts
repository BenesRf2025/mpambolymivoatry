// src/modules/agriculture/harvest/harvest.controller.ts
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
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from '../dto/create-harvest.dto';

@ApiTags('Harvests')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('harvests')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  @ApiOperation({ summary: 'Enregistrer une nouvelle récolte' })
  @ApiResponse({ status: 201, description: 'Récolte enregistrée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() dto: CreateHarvestDto) {
    return this.harvestService.create(dto);
  }

  @Get('available')
  @ApiOperation({ summary: 'Lister les récoltes disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des récoltes disponibles' })
  findAvailable(@Request() req) {
    return this.harvestService.findAvailableByUser(req.user.userId);
  }
}
