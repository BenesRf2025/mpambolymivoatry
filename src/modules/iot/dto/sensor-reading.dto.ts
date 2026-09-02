// src/modules/iot/dto/sensor-reading.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SensorReadingDto {
  @ApiProperty({
    example: 'DEV-001-VKN',
    description: 'Code du device (pas son UUID)',
  })
  @IsString()
  deviceCode: string;

  @ApiPropertyOptional({ example: 25.5 })
  @IsOptional()
  @IsNumber()
  soilHumidity?: number;

  @ApiPropertyOptional({ example: 28.3 })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional({ example: 65 })
  @IsOptional()
  @IsNumber()
  airHumidity?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  rainfall?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  waterLevel?: number;

  @ApiPropertyOptional({ example: 3.7 })
  @IsOptional()
  @IsNumber()
  batteryVoltage?: number;
}
