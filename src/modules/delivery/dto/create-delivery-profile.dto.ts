// src/modules/delivery/dto/create-delivery-profile.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { VehicleType } from '../enums/vehicle-type.enum';

export class CreateDeliveryProfileDto {
  @ApiProperty({ enum: VehicleType, example: VehicleType.MOTO })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiPropertyOptional({
    description: "Rayon d'action en km (par défaut selon le véhicule)",
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxDistanceKm?: number;
}
