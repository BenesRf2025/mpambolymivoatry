// src/modules/association/dto/update-member-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AssociationMemberRole } from '../enums/association-member-role.enum';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: AssociationMemberRole })
  @IsEnum(AssociationMemberRole)
  memberRole: AssociationMemberRole;
}
