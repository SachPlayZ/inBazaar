/* eslint-disable prettier/prettier */
// import { Body, Controller, Get, Post } from '@nestjs/common';
// import { BargainService } from './bargain.service';

// @Controller('/bargain')
// export class BargainController {
//   constructor(private readonly bargainService: BargainService) {}

//   @Post('/scraped-price')
//   async getBestPrice(@Body() body: { cartItemId: string }) {
//     return await this.bargainService.getScrapedPrice(body.cartItemId);
//   }

//   @Post('/chat')
//   async doBargain(@Body() body: { productId: string }) {
//     // // Use the bargain service to find the product by its ID.
//     // const product = await this.bargainService.findProductById(body.productId);
//     // // Now the product is stored in the 'product' variable; you can process it further if needed.
//     // return { message: 'Product found', product };
//   }

//   @Post('/accept')
//   accept_bargain() {
//     //Should call out to the order accept model
//   }

//   @Post('/decline')
//   decline_bargain() {}
// }

import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { BargainService } from './bargain.service';
import { APIResponse, BargainingResponse } from '../../agent/bargainingAgent';
import { OrderDecisionDto } from 'src/order/dto/Order.dto';
import { OrderService } from 'src/order/order.service';

@Controller('bargain')
export class BargainController {
  constructor(
    private readonly bargainService: BargainService,
    private readonly orderService: OrderService,
  ) {}

  @Get('scraped-price')
  async getScrapedPrice(@Query('cartItemId') cartItemId: string) {
    if (!cartItemId) {
      throw new BadRequestException('cartItemId query parameter is required');
    }
    return await this.bargainService.getScrapedPrice(cartItemId);
  }

  @Post('/chat')
  async getBargain(
    @Query('cartItemId') cartItemId: string,
  ): Promise<APIResponse<BargainingResponse>> {
    if (!cartItemId) {
      throw new BadRequestException('cartItemId query parameter is required');
    }
    return await this.bargainService.doBargain(cartItemId);
  }

  // @Get('getBargain')
  // async getBargain(
  //   @Query('cartItemId') cartItemId: string,
  // ): Promise<IBargainingResponse> {
  //   if (!cartItemId) {
  //     throw new BadRequestException('cartItemId query parameter is required');
  //   }
  //   return await this.bargainService.doBargain(cartItemId);
  // }

  @Post('/accept')
  async acceptBargain(
    @Body() body: { cartItemId: string; suggestedPrice: number },
  ) {
    const { cartItemId, suggestedPrice } = body;
    if (!cartItemId) {
      throw new BadRequestException('cartItemId is required in the body');
    }
    if (suggestedPrice === undefined || suggestedPrice === null) {
      throw new BadRequestException('suggestedPrice is required in the body');
    }
    if (isNaN(suggestedPrice)) {
      throw new BadRequestException('Invalid suggestedPrice value');
    }
    return await this.bargainService.acceptBargain(cartItemId, suggestedPrice);
  }

  @Post('/continue')
  async continue_bargain(
    @Body()
    body: {
      cartItemId: string;
      currentPrice: number;
      initialPrice: number;
      stopLossPercentage: number;
    },
  ) {
    const { cartItemId, currentPrice, initialPrice, stopLossPercentage } = body;
    return await this.bargainService.continueBargain(
      cartItemId,
      currentPrice,
      initialPrice,
      stopLossPercentage,
    );
  }

  @Post('/decline')
  async declineBargain(@Body() orderDecisionDto: OrderDecisionDto) {
    const { username, productId } = orderDecisionDto;
    return await this.orderService.declineOrder(username, productId);
  }
}
