// src/modules/marketplace/dto/create-product.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Riz Vary Gasy' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Céréales' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Riz de qualité récolté en septembre' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  priceAr: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.1)
  quantityKg: number;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'ID de la récolte source (optionnel)',
    example: 'uuid-de-la-recolte',
  })
  @IsOptional()
  @IsString()
  sourceHarvestId?: string;
}
