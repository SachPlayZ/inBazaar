import { Module } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';
import { BargainController } from './bargain.controller';
import { BargainService } from './bargain.service';

@Module({
  controllers: [BargainController],
  providers: [BargainService, PrismaService],
})
export class BargainModule {}
