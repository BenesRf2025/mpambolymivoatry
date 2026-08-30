// src/modules/family/dto/create-family.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFamilyDto {
  @ApiProperty({ description: 'Nom de la famille' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'ID du chef de famille (utilisateur)' })
  @IsOptional()
  @IsUUID()
  headUserId?: string;
}
