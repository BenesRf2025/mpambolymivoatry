// src/modules/iot/dto/register-device.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'uuid-de-la-parcelle' })
  @IsString()
  parcelId: string;

  @ApiProperty({ example: 'DEV-001-VKN' })
  @IsString()
  deviceCode: string;

  @ApiPropertyOptional({ example: 'SOIL_SENSOR' })
  @IsOptional()
  @IsString()
  deviceType?: string;

  @ApiPropertyOptional({ example: '1.0.2' })
  @IsOptional()
  @IsString()
  firmwareVersion?: string;
}
