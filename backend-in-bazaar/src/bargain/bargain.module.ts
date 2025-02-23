import { Module } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';
import { BargainController } from './bargain.controller';
import { BargainService } from './bargain.service';
import { OrderController } from 'src/order/order.controller';
import { OrderService } from 'src/order/order.service';

@Module({
  controllers: [BargainController, OrderController],
  providers: [BargainService, PrismaService, OrderService],
})
export class BargainModule {}
