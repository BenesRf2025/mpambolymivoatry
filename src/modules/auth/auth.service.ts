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
    return this.generateToken(
      user.id,
      user.phoneNumber,
      user.roles,
      user.fullName,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhone(dto.phone);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return this.generateToken(
      user.id,
      user.phoneNumber,
      user.roles,
      user.fullName,
    );
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      id: user.id,
      name: user.fullName,
      phone: user.phoneNumber,
      roles: user.roles,
    };
  }

  private generateToken(
    userId: string,
    phoneNumber: string,
    roles: string[],
    fullName?: string,
  ) {
    const payload = { sub: userId, phoneNumber, roles };
    return {
      token: this.jwtService.sign(payload),
      user: { id: userId, name: fullName, phone: phoneNumber, roles },
    };
  }
}
