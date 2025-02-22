import { Body, Controller, Get, Post } from '@nestjs/common';
import { BargainService } from './bargain.service';

@Controller('/bargain')
export class BargainController {
  constructor(private readonly bargainService: BargainService) {}

  @Post('/scraped-price')
  async getBestPrice(@Body() body: { cartItemId: string }) {
    return await this.bargainService.getScrapedPrice(body.cartItemId);
  }

  @Post('/chat')
  async doBargain(@Body() body: { productId: string }) {
    // // Use the bargain service to find the product by its ID.
    // const product = await this.bargainService.findProductById(body.productId);
    // // Now the product is stored in the 'product' variable; you can process it further if needed.
    // return { message: 'Product found', product };
  }

  @Post('/accept')
  accept_bargain() {
    //Should call out to the order accept model
  }

  @Post('/decline')
  decline_bargain() {}
}
