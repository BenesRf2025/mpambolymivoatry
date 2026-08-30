import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SELF_ASSIGNABLE_ROLES, UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const invalidRoles = dto.roles.filter(
      (r) => !SELF_ASSIGNABLE_ROLES.includes(r),
    );
    if (invalidRoles.length > 0) {
      throw new BadRequestException(
        `Rôle(s) non autorisé(s) à l'inscription : ${invalidRoles.join(', ')}`,
      );
    }

    const existing = await this.userRepo.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (existing) {
      throw new ConflictException('Ce numéro est déjà utilisé');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      email: dto.email ?? null,
      passwordHash,
      roles: dto.roles,
    });

    return this.userRepo.save(user);
  }

  async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { phoneNumber },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        passwordHash: true,
        roles: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async seedDefaultAdmin() {
    const existing = await this.userRepo.findOne({
      where: { phoneNumber: '0383462258' },
    });
    if (existing) return;

    const passwordHash = await bcrypt.hash('Benes123', 10);
    const user = this.userRepo.create({
      fullName: 'Administrateur Plateforme',
      phoneNumber: '0383462258',
      email: 'admin@mpamboly.mg',
      passwordHash,
      roles: [UserRole.ADMINISTRATEUR],
    });
    await this.userRepo.save(user);
  }
}
