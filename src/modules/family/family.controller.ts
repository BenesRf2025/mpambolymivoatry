// src/modules/family/family.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyService } from './family.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { GenerateFamilyTokenDto } from './dto/generate-family-token.dto';
import { RegisterWithFamilyTokenDto } from './dto/register-with-family-token.dto';

@ApiTags('Family')
@ApiBearerAuth('JWT-auth')
@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Créer une famille (admin)' })
  @ApiBody({ type: CreateFamilyDto })
  async createFamily(@Request() req, @Body() dto: CreateFamilyDto) {
    return this.familyService.createFamily(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('token/generate')
  @ApiOperation({ summary: 'Générer un jeton de famille (admin)' })
  @ApiBody({ type: GenerateFamilyTokenDto })
  async generateToken(@Request() req, @Body() dto: GenerateFamilyTokenDto) {
    return this.familyService.generateToken(dto, req.user.userId);
  }

  @Post('register')
  @ApiOperation({ summary: 'S\'inscrire avec un jeton de famille' })
  @ApiBody({ type: RegisterWithFamilyTokenDto })
  async registerWithFamilyToken(@Body() dto: RegisterWithFamilyTokenDto) {
    return this.familyService.registerWithFamilyToken(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('members')
  @ApiOperation({ summary: 'Lister les membres de ma famille' })
  async getMembers(@Request() req) {
    const family = await this.familyService.getFamilyByUserId(req.user.userId);
    if (!family) {
      return [];
    }
    return this.familyService.getFamilyMembers(family.id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('activities')
  @ApiOperation({ summary: 'Lister les activités de ma famille' })
  async getActivities(@Request() req) {
    const family = await this.familyService.getFamilyByUserId(req.user.userId);
    if (!family) {
      return [];
    }
    return this.familyService.getFamilyActivities(family.id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Récupérer ma famille' })
  async getMyFamily(@Request() req) {
    const family = await this.familyService.getFamilyByUserId(req.user.userId);
    if (!family) {
      return null;
    }
    return family;
  }
}
