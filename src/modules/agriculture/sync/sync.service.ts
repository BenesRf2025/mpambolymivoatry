// src/modules/agriculture/sync/sync.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncAction } from '../entities/sync-action.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncAction)
    private readonly syncActionRepo: Repository<SyncAction>,
  ) {}

  async processBatch(
    userId: string,
    actions: any[],
  ): Promise<{ applied: string[]; errors: any[] }> {
    const applied: string[] = [];
    const errors: any[] = [];

    for (const action of actions) {
      try {
        const syncAction = this.syncActionRepo.create({
          type: action.type,
          clientId: action.clientId,
          payload: action.payload,
          applied: true,
        });
        await this.syncActionRepo.save(syncAction);
        applied.push(action.clientId);
      } catch (error: any) {
        errors.push({
          clientId: action.clientId,
          message: error?.message ?? 'Erreur inconnue',
        });
      }
    }

    return { applied, errors };
  }
}
