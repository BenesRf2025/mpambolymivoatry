// src/modules/agriculture/dto/create-inspection.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInspectionDto {
  @ApiProperty({ description: 'ID de la parcelle à inspecter' })
  @IsString()
  parcelId: string;

  @ApiPropertyOptional({ description: "Observations de l'inspection" })
  @IsOptional()
  @IsString()
  observation?: string;
}

export class CompleteInspectionDto {
  @ApiPropertyOptional({ description: "Observations finales de l'inspection" })
  @IsOptional()
  @IsString()
  observation?: string;

  @ApiPropertyOptional({ description: 'URL de la note vocale' })
  @IsOptional()
  @IsString()
  voiceNoteUrl?: string;
}
