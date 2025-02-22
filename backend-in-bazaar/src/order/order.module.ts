import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { PrismaService } from 'lib/database/prisma.service';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
