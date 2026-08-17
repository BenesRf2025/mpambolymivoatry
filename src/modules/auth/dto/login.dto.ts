// src/modules/auth/dto/login.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Numéro de téléphone malgache' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur" })
  @IsString()
  password: string;
}
