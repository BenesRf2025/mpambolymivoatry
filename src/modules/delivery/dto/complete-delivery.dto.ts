// src/modules/delivery/dto/complete-delivery.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompleteDeliveryDto {
  @ApiPropertyOptional({ example: 'https://storage.example.com/proof123.jpg' })
  @IsOptional()
  @IsString()
  proofPhotoUrl?: string;
}
