// src/modules/agriculture/inspection/inspection.controller.ts
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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InspectionService } from './inspection.service';
import {
  CreateInspectionDto,
  CompleteInspectionDto,
} from '../dto/create-inspection.dto';
import { AiAdviceService } from '../ai-advice/ai-advice.service';

@ApiTags('Inspections')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('inspections')
export class InspectionController {
  constructor(
    private readonly inspectionService: InspectionService,
    private readonly aiAdviceService: AiAdviceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle inspection' })
  @ApiResponse({ status: 201, description: 'Inspection créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Request() req, @Body() dto: CreateInspectionDto) {
    return this.inspectionService.create(req.user.userId, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Compléter une inspection' })
  @ApiParam({ name: 'id', description: "ID de l'inspection" })
  @ApiResponse({ status: 200, description: 'Inspection complétée' })
  @ApiResponse({ status: 404, description: 'Inspection non trouvée' })
  complete(@Param('id') id: string, @Body() dto: CompleteInspectionDto) {
    return this.inspectionService.complete(id, dto);
  }

  @Get('parcel/:parcelId')
  @ApiOperation({ summary: "Lister les inspections d'une parcelle" })
  @ApiParam({ name: 'parcelId', description: 'ID de la parcelle' })
  @ApiResponse({ status: 200, description: 'Liste des inspections' })
  findByParcel(@Param('parcelId') parcelId: string) {
    return this.inspectionService.findByParcel(parcelId);
  }

  @Get('advice')
  @ApiOperation({ summary: 'Obtenir des conseils IA sur les cultures' })
  @ApiResponse({ status: 200, description: 'Conseils générés par IA' })
  getAdvice(
    @Request() req,
    // Query params simplifiés pour la démo
  ) {
    return this.aiAdviceService.generateAdvice({
      cropName: 'Riz',
      soilHumidity: 25,
      temperature: 28,
      daysSincePlanting: 60,
    });
  }
}
