// src/modules/marketplace/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemInputDto {
  @ApiProperty({ example: 'uuid-du-produit' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.1)
  quantityKg: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-de-la-boutique' })
  @IsString()
  shopId: string;

  @ApiProperty({ example: 'Antananarivo, 67ha' })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];
}
