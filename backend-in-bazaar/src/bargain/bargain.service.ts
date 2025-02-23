import { Injectable, Logger } from '@nestjs/common';
import { BargainingAgent } from 'agent/bargainingAgent';
import { getPriceSuggestion } from 'agent/priceAgent';
import { PrismaService } from 'lib/database/prisma.service';

@Injectable()
export class BargainService {
  private readonly logger = new Logger(BargainService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findProductById(productId: string) {
    // Find the product using Prisma.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    // console.log('Product found:', product);
    return product;
  }

  async getScrapedPrice(cartItemId: string) {
    if (!cartItemId) {
      throw new Error('cartItemId is required');
    }

    // Find the cart item using its id.
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { productId: true },
    });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Use the product id from the cart item to get the product details.
    const product = await this.findProductById(cartItem.productId);
    // console.log('Scraped product details:', product);

    const val = await getPriceSuggestion(
      product.name,
      product.measuringUnit,
      product.price,
    );
    return { suggestedPrice: val.suggestion.suggestedPrice };
  }

  async doBargain(cartItemId: string) {
    if (!cartItemId) {
      throw new Error('cartItemId is required');
    }

    // Find the cart item using its id.
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { productId: true },
    });
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Use the product id from the cart item to get the product details.
    const product = await this.findProductById(cartItem.productId);

    const agent = new BargainingAgent();

    const res1 = agent.startBargaining(
      product.name,
      product.measuringUnit,
      product.price,
      product.stoploss,
    );
    console.log(res1);
  }
}
