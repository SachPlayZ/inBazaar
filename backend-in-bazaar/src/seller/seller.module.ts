import { Module } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySecretKey', // Ensure this value is not empty
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [SellerService, PrismaService],
  controllers: [SellerController],
})
export class SellerModule {}
