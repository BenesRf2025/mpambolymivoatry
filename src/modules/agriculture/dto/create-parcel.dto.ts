// src/modules/agriculture/dto/create-parcel.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateParcelDto {
  @ApiProperty({ description: 'Nom de la parcelle' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Superficie de la parcelle en m²' })
  @IsNumber()
  areaM2: number;

  @ApiPropertyOptional({ description: 'Latitude de la parcelle' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude de la parcelle' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Type de sol' })
  @IsOptional()
  @IsString()
  soilType?: string;
}
