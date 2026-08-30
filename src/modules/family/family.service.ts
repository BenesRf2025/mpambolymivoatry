// src/modules/family/family.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Family } from './entities/family.entity';
import { FamilyMember } from './entities/family-member.entity';
import { FamilyToken } from './entities/family-token.entity';
import { ActivityTrace } from './entities/activity-trace.entity';
import { ActivityActionType } from './entities/activity-trace.entity';
import { User } from '../users/entities/user.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { GenerateFamilyTokenDto } from './dto/generate-family-token.dto';
import { RegisterWithFamilyTokenDto } from './dto/register-with-family-token.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepo: Repository<Family>,
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepo: Repository<FamilyMember>,
    @InjectRepository(FamilyToken)
    private readonly familyTokenRepo: Repository<FamilyToken>,
    @InjectRepository(ActivityTrace)
    private readonly activityTraceRepo: Repository<ActivityTrace>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createFamily(dto: CreateFamilyDto, createdBy: string): Promise<Family> {
    const family = this.familyRepo.create({
      name: dto.name,
      headUserId: dto.headUserId ?? null,
    });

    const savedFamily = await this.familyRepo.save(family);

    if (dto.headUserId) {
      await this.familyMemberRepo.save({
        familyId: savedFamily.id,
        userId: dto.headUserId,
        userName: (await this.userRepo.findOne({ where: { id: dto.headUserId } }))?.fullName ?? '',
        roleInFamily: 'head',
      });
    }

    return savedFamily;
  }

  async generateToken(dto: GenerateFamilyTokenDto, createdBy: string): Promise<{ token: string }> {
    const family = await this.familyRepo.findOne({ where: { id: dto.familyId } });
    if (!family) {
      throw new NotFoundException('Famille introuvable');
    }

    const tokenString = `FAM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const familyToken = this.familyTokenRepo.create({
      token: tokenString,
      familyId: dto.familyId,
      createdBy,
      maxUses: dto.maxUses ?? 10,
    });

    await this.familyTokenRepo.save(familyToken);
    return { token: tokenString };
  }

  async registerWithFamilyToken(dto: RegisterWithFamilyTokenDto): Promise<{ user: User; token: string }> {
    const familyToken = await this.familyTokenRepo.findOne({
      where: { token: dto.familyToken, isActive: true },
      relations: { family: true },
    });

    if (!familyToken) {
      throw new BadRequestException('Jeton de famille invalide ou expiré');
    }

    if (familyToken.usedCount >= familyToken.maxUses) {
      throw new BadRequestException('Ce jeton a atteint le nombre maximum d\'utilisations');
    }

    const existingUser = await this.userRepo.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (existingUser) {
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
    const savedUser = await this.userRepo.save(user);

    await this.familyMemberRepo.save({
      familyId: familyToken.familyId,
      userId: savedUser.id,
      userName: savedUser.fullName,
      roleInFamily: 'member',
    });

    familyToken.usedCount += 1;
    if (familyToken.usedCount >= familyToken.maxUses) {
      familyToken.isActive = false;
    }
    await this.familyTokenRepo.save(familyToken);

    const jwtToken = `jwt_${savedUser.id}_${Date.now()}`;

    return {
      user: savedUser,
      token: jwtToken,
    };
  }

  async getFamilyMembers(familyId: string, requestingUserId: string): Promise<FamilyMember[]> {
    const member = await this.familyMemberRepo.findOne({
      where: { familyId, userId: requestingUserId },
    });

    if (!member) {
      throw new ForbiddenException('Vous n\'êtes pas membre de cette famille');
    }

    return this.familyMemberRepo.find({ where: { familyId } });
  }

  async getFamilyActivities(familyId: string, requestingUserId: string): Promise<ActivityTrace[]> {
    const member = await this.familyMemberRepo.findOne({
      where: { familyId, userId: requestingUserId },
    });

    if (!member) {
      throw new ForbiddenException('Vous n\'êtes pas membre de cette famille');
    }

    return this.activityTraceRepo.find({
      where: { familyId },
      order: { timestamp: 'DESC' },
    });
  }

  async logActivity(
    familyId: string,
    userId: string,
    userName: string,
    actionType: ActivityActionType,
    entityType: string,
    entityId: string,
    details?: Record<string, any>,
  ): Promise<void> {
    const trace = this.activityTraceRepo.create({
      familyId,
      userId,
      userName,
      actionType,
      entityType,
      entityId,
      details,
    });

    await this.activityTraceRepo.save(trace);
  }

  async getFamilyById(familyId: string): Promise<Family | null> {
    return this.familyRepo.findOne({ where: { id: familyId } });
  }

  async getFamiliesByUserId(userId: string): Promise<Family[]> {
    const members = await this.familyMemberRepo.find({
      where: { userId },
      relations: { family: true },
    });

    return members.map((m) => m.family);
  }

  async getFamilyByUserId(userId: string): Promise<Family | null> {
    const families = await this.getFamiliesByUserId(userId);
    return families.length > 0 ? families[0] : null;
  }
}
