// src/modules/marketplace/dto/create-shop.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateShopDto {
  @ApiProperty({ example: 'Boutique Rakoto' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Vente de riz et légumes frais' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Antsirabe, Fokontany X' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: -19.8667 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 47.0333 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
