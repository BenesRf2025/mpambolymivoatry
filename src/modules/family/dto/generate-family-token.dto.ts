// src/modules/family/dto/generate-family-token.dto.ts
import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateFamilyTokenDto {
  @ApiProperty({ description: 'ID de la famille' })
  @IsUUID()
  familyId: string;

  @ApiPropertyOptional({ description: 'Nombre max d\'utilisations (défaut: 10)', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;
}
