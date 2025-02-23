/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { BargainingAgent } from 'agent/bargainingAgent';
import { getPriceSuggestion } from 'agent/priceAgent';
import { PrismaService } from 'lib/database/prisma.service';

export interface IBargainingResponse {
  success: boolean;
  data: any;
  message?: string;
}

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
    // if (!cartItemId) {
    //   throw new Error('cartItemId is required');
    // }

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
    // if (!cartItemId) {
    //   throw new Error('cartItemId is required');
    // }

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

    const res1 = await agent.startBargaining(
      product.name,
      product.measuringUnit,
      product.price,
      product.stoploss,
    );
    // console.log('muski2');

    return res1;
  }

  // async doBargain(cartItemId: string): Promise<IBargainingResponse> {
  //   if (!cartItemId) {
  //     throw new Error('cartItemId is required');
  //   }

  //   // Find the cart item using its id.
  //   const cartItem = await this.prisma.cartItem.findUnique({
  //     where: { id: cartItemId },
  //     select: { productId: true },
  //   });
  //   if (!cartItem) {
  //     throw new Error('Cart item not found');
  //   }

  //   // Use the product id from the cart item to get the product details.
  //   const product = await this.findProductById(cartItem.productId);
  //   if (!product) {
  //     throw new Error('Product not found');
  //   }

  //   // Create a new bargaining agent instance.
  //   const agent = new BargainingAgent();

  //   // Start bargaining using product details.
  //   const agentResponse = await agent.startBargaining(
  //     product.name,
  //     product.measuringUnit,
  //     product.price,
  //     product.stoploss,
  //   );

  //   this.logger.debug('Agent response: ' + JSON.stringify(agentResponse));

  //   // Map the external response to our local IBargainingResponse.
  //   // (Assuming agentResponse has properties: status, data, and message.)
  //   const mappedResponse: IBargainingResponse = {
  //     success: agentResponse?.status?.toLowerCase() === 'success', // Set to true if status is "success"
  //     data: agentResponse.data,
  //     message: agentResponse.message,
  //   };

  //   return mappedResponse;
  // }

  // async acceptBargain(cartItemId: string, suggestedPrice: number) {
  //   try {
  //     const updatedCartItem = await this.prisma.cartItem.update({
  //       where: { id: cartItemId },
  //       data: { discountedPrice: suggestedPrice },
  //       include: {
  //         product: {
  //           include: {
  //             Category: true,
  //             seller: true,
  //           },
  //         },
  //       },
  //     });
  //     this.logger.debug(
  //       `Updated cart item: ${JSON.stringify(updatedCartItem)}`,
  //     );
  //     return updatedCartItem;
  //   } catch (error) {
  //     this.logger.error('Error updating cart item discounted price:', error);
  //     throw error;
  //   }
  // }

  async acceptBargain(cartItemId: string, suggestedPrice: number) {
    try {
      // First verify the cart item exists
      const cartItem = await this.prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: {
          product: true,
        },
      });

      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      // Update the cart item with the new discounted price
      const updatedCartItem = await this.prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          discountedPrice: cartItem.quantity * suggestedPrice,
        },
      });

      this.logger.debug(
        `Updated cart item with discounted price: ${JSON.stringify(updatedCartItem)}`,
      );

      return updatedCartItem;
    } catch (error) {
      this.logger.error('Error updating cart item discounted price:', error);
      throw error;
    }
  }
}
