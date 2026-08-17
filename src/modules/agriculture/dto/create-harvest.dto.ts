// src/modules/agriculture/dto/create-harvest.dto.ts
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHarvestDto {
  @ApiProperty({ description: 'ID de la culture' })
  @IsString()
  cropId: string;

  @ApiProperty({
    description: 'Date de la récolte (ISO 8601)',
    example: '2024-05-15',
  })
  @IsDateString()
  harvestedAt: string;

  @ApiProperty({ description: 'Quantité récolté en kg' })
  @IsNumber()
  quantityKg: number;

  @ApiPropertyOptional({ description: 'Note de qualité (A, B, C, etc.)' })
  @IsOptional()
  @IsString()
  qualityGrade?: string;
}
