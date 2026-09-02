// src/modules/iot/device/device.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DeviceService } from './device.service';
import { RegisterDeviceDto } from '../dto/register-device.dto';

@ApiTags('IoT - Devices')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('iot/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiOperation({
    summary: 'Enregistrer un nouveau capteur IoT sur une parcelle',
  })
  register(@Body() dto: RegisterDeviceDto) {
    return this.deviceService.register(dto);
  }

  @Get('parcel/:parcelId')
  @ApiOperation({ summary: "Lister les capteurs d'une parcelle" })
  findByParcel(@Param('parcelId') parcelId: string) {
    return this.deviceService.findByParcel(parcelId);
  }
}
