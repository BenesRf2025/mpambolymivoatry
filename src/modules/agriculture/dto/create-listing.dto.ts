// src/modules/agriculture/dto/create-listing.dto.ts
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({ description: 'ID du vendeur' })
  @IsString()
  sellerId: string;

  @ApiPropertyOptional({ description: 'Type de vendeur' })
  @IsOptional()
  @IsString()
  sellerType?: string;

  @ApiProperty({ description: 'Nom du produit' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description du produit' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Unité (kg, sac, litre, etc.)' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Quantité disponible' })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Prix en Ariary' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'URLs des images', type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];
}
