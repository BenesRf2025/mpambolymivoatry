// src/modules/association/dto/create-association.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { AssociationType } from '../enums/association-type.enum';

export class CreateAssociationDto {
  @ApiProperty({ example: 'Coopérative Riz Vakinankaratra' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AssociationType, example: AssociationType.COOPERATIVE })
  @IsEnum(AssociationType)
  type: AssociationType;

  @ApiPropertyOptional({ example: 'Coopérative de riziculteurs' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Antsirabe' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'REG-2026-00123' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;
}
