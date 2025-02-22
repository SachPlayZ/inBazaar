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
    return product;
  }

  async getScrapedPrice(cartItemId: string) {
    // Find the cart item using its id
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { productId: true },
    });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Use the product id from the cart item to get the product details.
    const product = await this.findProductById(cartItem.productId);
    console.log(product);
  }
}
