// src/modules/delivery/delivery-profile/delivery-profile.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { DeliveryProfileService } from './delivery-profile.service';
import { CreateDeliveryProfileDto } from '../dto/create-delivery-profile.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';

@ApiTags('Delivery - Profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LIVREUR)
@Controller('delivery-profile')
export class DeliveryProfileController {
  constructor(private readonly profileService: DeliveryProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Créer mon profil livreur (véhicule, rayon)' })
  create(@Request() req, @Body() dto: CreateDeliveryProfileDto) {
    return this.profileService.create(req.user.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Mon profil livreur' })
  getMine(@Request() req) {
    return this.profileService.findByUser(req.user.userId);
  }

  @Patch('availability')
  @ApiOperation({ summary: 'Activer/désactiver ma disponibilité' })
  setAvailability(@Request() req, @Body('available') available: boolean) {
    return this.profileService.setAvailability(req.user.userId, available);
  }

  @Patch('location')
  @ApiOperation({ summary: 'Mettre à jour ma position actuelle' })
  updateLocation(@Request() req, @Body() dto: UpdateLocationDto) {
    return this.profileService.updateLocation(req.user.userId, dto);
  }
}
