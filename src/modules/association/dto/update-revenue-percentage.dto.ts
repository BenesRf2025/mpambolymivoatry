// src/modules/association/dto/update-revenue-percentage.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class UpdateRevenuePercentageDto {
  @ApiProperty({ example: 15.5, description: 'Pourcentage entre 0 et 100' })
  @IsNumber()
  @Min(0)
  @Max(100)
  revenuePercentage: number;
}
