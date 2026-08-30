// src/modules/family/dto/register-with-family-token.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/enums/user-role.enum';

export class RegisterWithFamilyTokenDto {
  @ApiProperty({ description: 'Nom complet' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Numéro de téléphone malgache' })
  @Matches(/^(\+261|0)[0-9]{9}$/, {
    message: 'Numéro de téléphone malgache invalide',
  })
  phoneNumber: string;

  @ApiPropertyOptional({ description: "Email de l'utilisateur" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Mot de passe (minimum 6 caractères)' })
  @MinLength(6)
  password: string;

  @ApiProperty({ description: "Rôles de l'utilisateur", type: [String] })
  @IsString({ each: true })
  roles: UserRole[];

  @ApiProperty({ description: 'Jeton de famille' })
  @IsString()
  familyToken: string;
}
