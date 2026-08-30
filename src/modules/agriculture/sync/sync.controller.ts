// src/modules/agriculture/sync/sync.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SyncService } from './sync.service';

@ApiTags('Sync')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('batch')
  @ApiOperation({ summary: "Synchroniser un batch d'actions offline" })
  @ApiResponse({ status: 200, description: 'Synchronisation traitée' })
  syncBatch(@Request() req, @Body() payload: { actions: any[] }) {
    return this.syncService.processBatch(req.user.userId, payload.actions);
  }
}
