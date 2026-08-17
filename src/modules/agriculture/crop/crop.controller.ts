// src/modules/agriculture/crop/crop.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CropService } from './crop.service';
import { CreateCropDto } from '../dto/create-crop.dto';

@ApiTags('Crops')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle culture' })
  @ApiResponse({ status: 201, description: 'Culture créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Request() req, @Body() dto: CreateCropDto) {
    return this.cropService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Lister les cultures d'une parcelle" })
  @ApiQuery({
    name: 'parcelId',
    required: true,
    description: 'ID de la parcelle',
  })
  @ApiResponse({ status: 200, description: 'Liste des cultures' })
  findByParcel(@Query('parcelId') parcelId: string) {
    return this.cropService.findByParcel(parcelId);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une culture" })
  @ApiParam({ name: 'id', description: 'ID de la culture' })
  @ApiResponse({ status: 200, description: 'Détail de la culture' })
  @ApiResponse({ status: 404, description: 'Culture non trouvée' })
  findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }
}
