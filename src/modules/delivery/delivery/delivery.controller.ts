// src/modules/delivery/delivery/delivery.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { DeliveryService } from './delivery.service';
import { CompleteDeliveryDto } from '../dto/complete-delivery.dto';

@ApiTags('Delivery')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LIVREUR)
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('nearby')
  @ApiOperation({
    summary: 'Livraisons disponibles proches de moi (avec élargissement auto)',
  })
  findNearby(@Request() req) {
    return this.deliveryService.findNearbyForDriver(req.user.userId);
  }

  @Get('my-deliveries')
  @ApiOperation({ summary: 'Mes livraisons (historique + en cours)' })
  findMine(@Request() req) {
    return this.deliveryService.findMyDeliveries(req.user.userId);
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Accepter une livraison' })
  accept(@Request() req, @Param('id') id: string) {
    return this.deliveryService.accept(id, req.user.userId);
  }

  @Patch(':id/picked-up')
  @ApiOperation({ summary: 'Marquer "récupéré chez le vendeur"' })
  markPickedUp(@Request() req, @Param('id') id: string) {
    return this.deliveryService.markPickedUp(id, req.user.userId);
  }

  @Patch(':id/delivered')
  @ApiOperation({ summary: 'Confirmer la livraison (+ photo preuve)' })
  markDelivered(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: CompleteDeliveryDto,
  ) {
    return this.deliveryService.markDelivered(id, req.user.userId, dto);
  }

  @Patch(':id/failed')
  @ApiOperation({ summary: 'Signaler un échec de livraison' })
  markFailed(@Request() req, @Param('id') id: string) {
    return this.deliveryService.markFailed(id, req.user.userId);
  }
  @Get('by-order/:orderId')
  @ApiOperation({ summary: 'Voir la livraison liée à une commande' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.deliveryService.findByOrder(orderId);
  }
}
