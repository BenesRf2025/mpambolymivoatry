// src/modules/association/dto/approve-membership.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ApproveMembershipDto {
  @ApiProperty({ description: 'true = approuver, false = rejeter' })
  @IsBoolean()
  approved: boolean;
}
