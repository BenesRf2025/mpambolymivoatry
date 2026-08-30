// src/modules/family/family.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { FamilyMember } from './entities/family-member.entity';
import { FamilyToken } from './entities/family-token.entity';
import { ActivityTrace } from './entities/activity-trace.entity';
import { User } from '../users/entities/user.entity';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Family,
      FamilyMember,
      FamilyToken,
      ActivityTrace,
      User,
    ]),
    UsersModule,
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
