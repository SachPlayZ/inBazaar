// import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
// import { CartService } from './cart.service';

// @Controller('cart')
// export class CartController {
//   constructor(private readonly cartService: CartService) {}

//   // GET endpoint to retrieve the cart for a given username
//   @Get('/items/:username')
//   async getCart(@Param('username') username: string) {
//     return await this.cartService.getCart(username);
//   }

//   // POST endpoint to add a product to the cart for a given username
//   @Post('/items/:username')
//   async addProductToCart(
//     @Param('username') username: string,
//     @Body() body: { productId: string; quantity: number },
//   ) {
//     return await this.cartService.addProductToCart(
//       username,
//       body.productId,
//       body.quantity,
//     );
//   }

//   @Delete('/items/:username/:productId')
//   async removeProductFromCart(
//     @Param('username') username: string,
//     @Param('productId') productId: string,
//   ) {
//     return await this.cartService.removeProductFromCart(username, productId);
//   }
// }

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // GET endpoint to retrieve the cart for a given username
  @Get('/items/:username')
  async getCart(@Param('username') username: string) {
    return await this.cartService.getCart(username);
  }

  // POST endpoint to add a product to the cart for a given username
  @Post('/items/:username')
  async addProductToCart(
    @Param('username') username: string,
    @Body() body: { productId: string; quantity: number },
  ) {
    return await this.cartService.addProductToCart(
      username,
      body.productId,
      body.quantity,
    );
  }

  @Delete('/items/:username/:productId')
  async removeProductFromCart(
    @Param('username') username: string,
    @Param('productId') productId: string,
  ) {
    return await this.cartService.removeProductFromCart(username, productId);
  }
}
