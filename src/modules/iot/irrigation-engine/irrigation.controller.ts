// src/modules/iot/irrigation-engine/irrigation.controller.ts
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IrrigationEngineService } from './irrigation-engine.service';
import { UpdateIrrigationConfigDto } from '../dto/irrigation-config.dto';

@ApiTags('IoT - Irrigation')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('iot/irrigation')
export class IrrigationController {
  constructor(private readonly irrigationEngine: IrrigationEngineService) {}

  @Get('parcel/:parcelId/config')
  @ApiOperation({ summary: "Configuration d'irrigation de la parcelle" })
  getConfig(@Param('parcelId') parcelId: string) {
    return this.irrigationEngine.getConfigOrCreateDefault(parcelId);
  }

  @Patch('parcel/:parcelId/config')
  @ApiOperation({ summary: "Modifier la configuration d'irrigation" })
  updateConfig(
    @Param('parcelId') parcelId: string,
    @Body() dto: UpdateIrrigationConfigDto,
  ) {
    return this.irrigationEngine.updateConfig(parcelId, dto);
  }

  @Get('parcel/:parcelId/history')
  @ApiOperation({ summary: "Historique des événements d'irrigation" })
  getHistory(@Param('parcelId') parcelId: string) {
    return this.irrigationEngine.getHistory(parcelId);
  }

  @Post('parcel/:parcelId/trigger')
  @ApiOperation({ summary: 'Déclencher manuellement une irrigation' })
  manualTrigger(@Param('parcelId') parcelId: string) {
    return this.irrigationEngine.manualTrigger(parcelId);
  }
}
