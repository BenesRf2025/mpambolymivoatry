// src/modules/agriculture/sensors/sensors.controller.ts
import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SensorsService } from './sensors.service';
import { CreateTelemetryDto } from '../dto/create-telemetry.dto';

@ApiTags('Sensors')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister mes capteurs IoT' })
  @ApiResponse({ status: 200, description: 'Liste des capteurs' })
  findAll(@Request() req) {
    return this.sensorsService.findAllByUser(req.user.userId);
  }

  @Post(':sensorId/telemetry')
  @ApiOperation({ summary: 'Envoyer une télémesure' })
  @ApiResponse({ status: 201, description: 'Télémesure enregistrée' })
  @ApiResponse({ status: 404, description: 'Capteur introuvable' })
  async postTelemetry(
    @Param('sensorId') sensorId: string,
    @Body() dto: CreateTelemetryDto,
  ) {
    return this.sensorsService.createTelemetry(sensorId, dto);
  }
}
