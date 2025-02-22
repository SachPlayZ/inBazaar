import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';

@Injectable()
export class BargainService {
  constructor(private readonly prisma: PrismaService) {}

  async findProductById(productId: string) {
    // Find the product using Prisma.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    console.log(product);
  }
}
