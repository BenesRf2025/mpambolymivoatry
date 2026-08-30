// src/modules/agriculture/dto/create-telemetry.dto.ts
import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTelemetryDto {
  @ApiProperty({ description: 'Humidité du sol (%)' })
  @IsNumber()
  soilMoisture: number;

  @ApiPropertyOptional({ description: 'Niveau de batterie (%)' })
  @IsOptional()
  @IsNumber()
  battery?: number;

  @ApiPropertyOptional({ description: 'Température du sol (°C)' })
  @IsOptional()
  @IsNumber()
  soilTemperature?: number;

  @ApiPropertyOptional({ description: 'Humidité de l\'air (%)' })
  @IsOptional()
  @IsNumber()
  airHumidity?: number;

  @ApiPropertyOptional({ description: 'Précipitations (mm/h)' })
  @IsOptional()
  @IsNumber()
  rainfallMmPerHour?: number;

  @ApiPropertyOptional({ description: 'Horodatage ISO 8601' })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
