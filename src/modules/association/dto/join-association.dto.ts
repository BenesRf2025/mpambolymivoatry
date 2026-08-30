// src/modules/association/dto/join-association.dto.ts
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinAssociationDto {
  @ApiProperty({ description: 'ID de l\'association' })
  @IsUUID()
  associationId: string;
}
