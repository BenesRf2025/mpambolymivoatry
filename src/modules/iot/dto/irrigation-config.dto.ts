// src/modules/iot/dto/irrigation-config.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { IrrigationMode } from '../enums/irrigation-mode.enum';

export class UpdateIrrigationConfigDto {
  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minimumHumidity?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maximumHumidity?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  durationSeconds?: number;

  @ApiPropertyOptional({ enum: IrrigationMode })
  @IsOptional()
  @IsEnum(IrrigationMode)
  mode?: IrrigationMode;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
