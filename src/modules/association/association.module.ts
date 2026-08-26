// src/modules/association/association.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Association } from './entities/association.entity';
import { AssociationMember } from './entities/association-member.entity';
import { Harvest } from '../agriculture/entities/harvest.entity';

import { AssociationService } from './association.service';
import { AssociationController } from './association.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Association, AssociationMember, Harvest]),
  ],
  controllers: [AssociationController],
  providers: [AssociationService],
  exports: [AssociationService],
})
export class AssociationModule {}
