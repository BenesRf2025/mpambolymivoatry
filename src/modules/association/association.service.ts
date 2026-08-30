// src/modules/association/association.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Association } from './entities/association.entity';
import { AssociationMember } from './entities/association-member.entity';
import { AssociationMemberRole } from './enums/association-member-role.enum';
import { AssociationMemberStatus } from './enums/association-member-status.enum';
import { CreateAssociationDto } from './dto/create-association.dto';
import { Harvest } from '../agriculture/entities/harvest.entity';
import { HarvestStatus } from '../agriculture/enums/harvest-status.enum';

@Injectable()
export class AssociationService {
  constructor(
    @InjectRepository(Association)
    private readonly associationRepo: Repository<Association>,
    @InjectRepository(AssociationMember)
    private readonly memberRepo: Repository<AssociationMember>,
    @InjectRepository(Harvest)
    private readonly harvestRepo: Repository<Harvest>,
  ) {}

  // ─────────────────────────────────────────
  // CRÉATION
  // ─────────────────────────────────────────

  async create(
    creatorUserId: string,
    dto: CreateAssociationDto,
  ): Promise<Association> {
    const association = this.associationRepo.create({
      name: dto.name,
      type: dto.type,
      description: dto.description ?? null,
      location: dto.location ?? null,
      registrationNumber: dto.registrationNumber ?? null,
      verified: false,
    });

    const saved = await this.associationRepo.save(association);

    // Le créateur devient automatiquement GESTIONNAIRE
    const creatorMember = this.memberRepo.create({
      associationId: saved.id,
      userId: creatorUserId,
      memberRole: AssociationMemberRole.GESTIONNAIRE,
      revenuePercentage: 0,
      active: true,
    });
    await this.memberRepo.save(creatorMember);

    return this.findOne(saved.id);
  }

  // ─────────────────────────────────────────
  // LECTURE
  // ─────────────────────────────────────────

  async findAll(): Promise<Association[]> {
    return this.associationRepo.find({
      where: { verified: true },
      relations: { members: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingAssociations(): Promise<Association[]> {
    return this.associationRepo.find({
      where: { verified: false },
      relations: { members: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Association> {
    const association = await this.associationRepo.findOne({
      where: { id },
      relations: { members: true },
    });
    if (!association) throw new NotFoundException('Association introuvable');
    return association;
  }

  async findByUser(userId: string): Promise<AssociationMember[]> {
    return this.memberRepo.find({
      where: { userId, status: Not(AssociationMemberStatus.REJECTED) },
      relations: { association: true },
    });
  }

  // ─────────────────────────────────────────
  // ADHÉSION (demande en attente d'approbation du gestionnaire)
  // ─────────────────────────────────────────

  async join(
    associationId: string,
    userId: string,
  ): Promise<AssociationMember> {
    await this.findOne(associationId); // vérifie que l'association existe

    const existing = await this.memberRepo.findOne({
      where: { associationId, userId },
    });

    if (existing) {
      if (existing.status === AssociationMemberStatus.APPROVED && existing.active) {
        throw new ConflictException(
          'Vous êtes déjà membre de cette association',
        );
      }
      if (existing.status === AssociationMemberStatus.PENDING) {
        throw new ConflictException(
          'Une demande d\'adhésion est déjà en attente',
        );
      }
      // REJECTED ou ancien membre inactif -> on renouvelle la demande
      existing.status = AssociationMemberStatus.PENDING;
      existing.active = false;
      existing.memberRole = AssociationMemberRole.MEMBRE;
      existing.revenuePercentage = 0;
      return this.memberRepo.save(existing);
    }

    const member = this.memberRepo.create({
      associationId,
      userId,
      memberRole: AssociationMemberRole.MEMBRE,
      revenuePercentage: 0,
      active: false,
      status: AssociationMemberStatus.PENDING,
    });

    return this.memberRepo.save(member);
  }

  async leave(associationId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findOne({
      where: { associationId, userId },
    });
    if (!member) {
      throw new NotFoundException('Vous n\'appartenez pas à cette association');
    }

    if (member.memberRole === AssociationMemberRole.GESTIONNAIRE && member.active) {
      const activeManagers = await this.memberRepo.count({
        where: {
          associationId,
          memberRole: AssociationMemberRole.GESTIONNAIRE,
          active: true,
        },
      });
      if (activeManagers <= 1) {
        throw new BadRequestException(
          'Impossible de quitter : vous êtes le seul gestionnaire. Désignez un autre gestionnaire avant de partir.',
        );
      }
    }

    // Quitte (membre actif) ou annule une demande en attente
    member.active = false;
    member.status = AssociationMemberStatus.REJECTED;
    await this.memberRepo.save(member);
  }

  // ─────────────────────────────────────────
  // GESTION DES MEMBRES (réservé au gestionnaire)
  // ─────────────────────────────────────────

  async updateMemberRole(
    associationId: string,
    targetUserId: string,
    newRole: AssociationMemberRole,
    requesterUserId: string,
  ): Promise<AssociationMember> {
    await this.checkIsGestionnaire(associationId, requesterUserId);

    const targetMember = await this.getMemberOrThrow(
      associationId,
      targetUserId,
    );

    targetMember.memberRole = newRole;
    return this.memberRepo.save(targetMember);
  }

  async updateRevenuePercentage(
    associationId: string,
    targetUserId: string,
    percentage: number,
    requesterUserId: string,
  ): Promise<AssociationMember> {
    await this.checkIsGestionnaire(associationId, requesterUserId);

    const targetMember = await this.getMemberOrThrow(
      associationId,
      targetUserId,
    );

    targetMember.revenuePercentage = percentage;
    return this.memberRepo.save(targetMember);
  }

  async removeMember(
    associationId: string,
    targetUserId: string,
    requesterUserId: string,
  ): Promise<void> {
    await this.checkIsGestionnaire(associationId, requesterUserId);

    if (targetUserId === requesterUserId) {
      throw new BadRequestException(
        'Utilisez "quitter l\'association" pour vous retirer vous-même',
      );
    }

    const targetMember = await this.getMemberOrThrow(
      associationId,
      targetUserId,
    );

    targetMember.active = false;
    await this.memberRepo.save(targetMember);
  }

  // ─────────────────────────────────────────
  // APPROBATION DES DEMANDES (réservé au gestionnaire)
  // ─────────────────────────────────────────

  async getPendingRequests(
    associationId: string,
    requesterUserId: string,
  ): Promise<AssociationMember[]> {
    await this.checkIsGestionnaire(associationId, requesterUserId);
    return this.memberRepo.find({
      where: { associationId, status: AssociationMemberStatus.PENDING },
    });
  }

  async approveMembership(
    associationId: string,
    targetUserId: string,
    approved: boolean,
    requesterUserId: string,
  ): Promise<AssociationMember> {
    await this.checkIsGestionnaire(associationId, requesterUserId);

    const targetMember = await this.memberRepo.findOne({
      where: { associationId, userId: targetUserId },
    });
    if (!targetMember) {
      throw new NotFoundException('Demande d\'adhésion introuvable');
    }

    targetMember.status = approved
      ? AssociationMemberStatus.APPROVED
      : AssociationMemberStatus.REJECTED;
    targetMember.active = approved;
    return this.memberRepo.save(targetMember);
  }

  // ─────────────────────────────────────────
  // STOCK COLLECTIF (calcul dynamique)
  // ─────────────────────────────────────────

  async calculateCollectiveStock(associationId: string): Promise<{
    totalKg: number;
    memberCount: number;
  }> {
    await this.findOne(associationId);

    const result = await this.harvestRepo
      .createQueryBuilder('harvest')
      .innerJoin('harvest.crop', 'crop')
      .innerJoin('crop.parcel', 'parcel')
      .innerJoin(
        AssociationMember,
        'member',
        'member.userId = parcel.ownerUserId',
      )
      .where('member.associationId = :associationId', { associationId })
      .andWhere('member.active = true')
      .andWhere('harvest.status = :status', {
        status: HarvestStatus.DISPONIBLE,
      })
      .select('COALESCE(SUM(harvest.quantityKg), 0)', 'total')
      .getRawOne();

    const memberCount = await this.memberRepo.count({
      where: { associationId, active: true },
    });

    return {
      totalKg: parseFloat(result.total),
      memberCount,
    };
  }

  // ─────────────────────────────────────────
  // VÉRIFICATION (accès export/gros) - à activer par un admin
  // ─────────────────────────────────────────

  async setVerified(
    associationId: string,
    verified: boolean,
  ): Promise<Association> {
    const association = await this.findOne(associationId);
    association.verified = verified;
    return this.associationRepo.save(association);
  }

  // ─────────────────────────────────────────
  // HELPERS PRIVÉS
  // ─────────────────────────────────────────

  private async getMemberOrThrow(
    associationId: string,
    userId: string,
  ): Promise<AssociationMember> {
    const member = await this.memberRepo.findOne({
      where: { associationId, userId, active: true },
    });
    if (!member) {
      throw new NotFoundException(
        "Ce membre n'appartient pas (ou plus) à cette association",
      );
    }
    return member;
  }

  private async checkIsGestionnaire(
    associationId: string,
    userId: string,
  ): Promise<void> {
    const member = await this.memberRepo.findOne({
      where: { associationId, userId, active: true },
    });
    if (!member || member.memberRole !== AssociationMemberRole.GESTIONNAIRE) {
      throw new ForbiddenException(
        'Seul un gestionnaire peut effectuer cette action',
      );
    }
  }

  // Exposé pour d'autres modules (ex: ShopService pour créer boutique collective)
  async isGestionnaire(
    associationId: string,
    userId: string,
  ): Promise<boolean> {
    const member = await this.memberRepo.findOne({
      where: { associationId, userId, active: true },
    });
    return !!member && member.memberRole === AssociationMemberRole.GESTIONNAIRE;
  }
}
