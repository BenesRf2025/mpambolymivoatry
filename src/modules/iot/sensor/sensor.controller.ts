// src/modules/iot/sensor/sensor.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SensorService } from './sensor.service';
import { SensorReadingDto } from '../dto/sensor-reading.dto';

@ApiTags('IoT - Sensors')
@Controller('iot/sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  // ⚠️ Pas de guard JWT ici : le capteur physique n'a pas de token utilisateur,
  // il s'identifie via son deviceCode (à sécuriser via clé API device en prod)
  @Post('readings')
  @ApiOperation({
    summary: 'Recevoir une lecture de capteur (appelé par le device IoT)',
  })
  ingest(@Body() dto: SensorReadingDto) {
    return this.sensorService.ingest(dto);
  }

  @Get('parcel/:parcelId/history')
  @ApiOperation({ summary: "Historique des lectures d'une parcelle" })
  getHistory(@Param('parcelId') parcelId: string) {
    return this.sensorService.getHistoryByParcel(parcelId);
  }

  @Get('parcel/:parcelId/latest')
  @ApiOperation({ summary: 'Dernière lecture en temps réel' })
  getLatest(@Param('parcelId') parcelId: string) {
    return this.sensorService.getLatestByParcel(parcelId);
  }
}
