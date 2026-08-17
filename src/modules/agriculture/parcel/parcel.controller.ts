// src/modules/agriculture/parcel/parcel.controller.ts
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
import { ParcelService } from './parcel.service';
import { CreateParcelDto } from '../dto/create-parcel.dto';

@ApiTags('Parcels')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('parcels')
export class ParcelController {
  constructor(private readonly parcelService: ParcelService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle parcelle' })
  create(@Request() req, @Body() dto: CreateParcelDto) {
    return this.parcelService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes parcelles' })
  findMine(@Request() req) {
    return this.parcelService.findAllByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une parcelle avec ses cultures" })
  findOne(@Param('id') id: string) {
    return this.parcelService.findOne(id);
  }
}
