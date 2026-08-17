// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.generateToken(user.id, user.phoneNumber, user.roles);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhone(dto.phoneNumber);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.generateToken(user.id, user.phoneNumber, user.roles);
  }

  private generateToken(userId: string, phoneNumber: string, roles: string[]) {
    const payload = { sub: userId, phoneNumber, roles };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: userId, phoneNumber, roles },
    };
  }
}
