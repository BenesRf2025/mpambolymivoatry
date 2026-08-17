// src/modules/users/dto/create-user.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: "Nom complet de l'utilisateur" })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Numéro de téléphone malgache (+261 ou 0)' })
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
  @IsArray()
  @ArrayNotEmpty()
  roles: UserRole[];
}
