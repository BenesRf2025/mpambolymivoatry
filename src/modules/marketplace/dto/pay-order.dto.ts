// src/modules/marketplace/dto/pay-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class PayOrderDto {
  @ApiProperty({
    example: 'MVOLA',
    enum: ['MVOLA', 'ORANGE_MONEY', 'SIMULATED'],
  })
  @IsString()
  @IsIn(['MVOLA', 'ORANGE_MONEY', 'SIMULATED'])
  provider: string;
}
