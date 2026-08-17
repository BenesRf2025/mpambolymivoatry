// src/modules/agriculture/dto/create-crop.dto.ts
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCropDto {
  @ApiProperty({ description: 'ID de la parcelle' })
  @IsString()
  parcelId: string;

  @ApiProperty({ description: 'Nom de la culture' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Variété de la culture' })
  @IsOptional()
  @IsString()
  variety?: string;

  @ApiProperty({
    description: 'Date de plantation (ISO 8601)',
    example: '2024-01-15',
  })
  @IsDateString()
  plantingDate: string;

  @ApiPropertyOptional({
    description: 'Date prévue de récolte (ISO 8601)',
    example: '2024-05-15',
  })
  @IsOptional()
  @IsDateString()
  expectedHarvestDate?: string;

  @ApiPropertyOptional({ description: 'Rendement estimé en kg' })
  @IsOptional()
  @IsNumber()
  estimatedYieldKg?: number;
}
