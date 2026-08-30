// src/modules/association/association.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssociationService } from './association.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UpdateRevenuePercentageDto } from './dto/update-revenue-percentage.dto';
import { ApproveMembershipDto } from './dto/approve-membership.dto';

@ApiTags('Association')
@Controller('associations')
export class AssociationController {
  constructor(private readonly associationService: AssociationService) {}

  @Get()
  @ApiOperation({ summary: 'Lister toutes les associations (public)' })
  findAll() {
    return this.associationService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('admin/pending')
  @ApiOperation({ summary: 'Associations en attente d\'approbation (admin)' })
  getPending(@Request() req) {
    if (!req.user.roles?.includes('administrateur')) {
      throw new ForbiddenException('Seul un administrateur peut voir les demandes');
    }
    return this.associationService.getPendingAssociations();
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une association avec ses membres" })
  findOne(@Param('id') id: string) {
    return this.associationService.findOne(id);
  }

  @Get(':id/stock')
  @ApiOperation({
    summary: 'Stock collectif disponible (calcul en temps réel)',
  })
  getCollectiveStock(@Param('id') id: string) {
    return this.associationService.calculateCollectiveStock(id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Créer une association (vous devenez gestionnaire)',
  })
  create(@Request() req, @Body() dto: CreateAssociationDto) {
    return this.associationService.create(req.user.userId, dto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('me/list')
  @ApiOperation({ summary: 'Mes associations (dont je suis membre)' })
  findMine(@Request() req) {
    return this.associationService.findByUser(req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  @ApiOperation({ summary: 'Demander à rejoindre une association (en attente d\'approbation)' })
  join(@Request() req, @Param('id') id: string) {
    return this.associationService.join(id, req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id/requests')
  @ApiOperation({ summary: 'Demandes d\'adhésion en attente (gestionnaire)' })
  getPendingRequests(@Request() req, @Param('id') id: string) {
    return this.associationService.getPendingRequests(id, req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post(':id/members/:userId/approve')
  @ApiOperation({ summary: 'Approuver/refuser une demande d\'adhésion (gestionnaire)' })
  approveMembership(
    @Request() req,
    @Param('id') associationId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: ApproveMembershipDto,
  ) {
    return this.associationService.approveMembership(
      associationId,
      targetUserId,
      dto.approved,
      req.user.userId,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  @ApiOperation({ summary: "Quitter l'association" })
  leave(@Request() req, @Param('id') id: string) {
    return this.associationService.leave(id, req.user.userId);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:userId/role')
  @ApiOperation({ summary: "Changer le rôle d'un membre (gestionnaire)" })
  updateMemberRole(
    @Request() req,
    @Param('id') associationId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.associationService.updateMemberRole(
      associationId,
      targetUserId,
      dto.memberRole,
      req.user.userId,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/members/:userId/revenue-percentage')
  @ApiOperation({
    summary: 'Définir le pourcentage de revenu (gestionnaire)',
  })
  updateRevenuePercentage(
    @Request() req,
    @Param('id') associationId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateRevenuePercentageDto,
  ) {
    return this.associationService.updateRevenuePercentage(
      associationId,
      targetUserId,
      dto.revenuePercentage,
      req.user.userId,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Retirer un membre (gestionnaire)' })
  removeMember(
    @Request() req,
    @Param('id') associationId: string,
    @Param('userId') targetUserId: string,
  ) {
    return this.associationService.removeMember(
      associationId,
      targetUserId,
      req.user.userId,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify')
  @ApiOperation({ summary: 'Approuver la création de l\'association (admin)' })
  verify(@Request() req, @Param('id') id: string) {
    if (!req.user.roles?.includes('administrateur')) {
      throw new ForbiddenException(
        'Seul un administrateur peut approuver la création',
      );
    }
    return this.associationService.setVerified(id, true);
  }
}
