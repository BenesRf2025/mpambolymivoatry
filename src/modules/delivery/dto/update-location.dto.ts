// src/modules/delivery/dto/update-location.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: -18.9146 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 47.5316 })
  @IsNumber()
  longitude: number;
}
