// src/modules/association/dto/approve-member.dto.ts
import { IsUUID, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveMemberDto {
  @ApiProperty({ description: 'ID du membre de l\'association' })
  @IsUUID()
  associationMemberId: string;

  @ApiProperty({ description: 'Approuver ou rejeter' })
  @IsBoolean()
  approved: boolean;

  @ApiPropertyOptional({ description: 'Raison du rejet (si rejeté)' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
