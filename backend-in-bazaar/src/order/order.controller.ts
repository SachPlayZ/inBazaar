// import { Body, Controller, Post } from '@nestjs/common';
// import { OrderService } from './order.service';
// import { OrderDecisionDto } from './dto/Order.dto';

// @Controller('order')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Post('accept')
//   async acceptOrder(@Body() orderDecisionDto: OrderDecisionDto) {
//     const { username, productId } = orderDecisionDto;
//     return await this.orderService.acceptOrder(username, productId);
//   }

//   @Post('decline')
//   async declineOrder(@Body() orderDecisionDto: OrderDecisionDto) {
//     const { username, productId } = orderDecisionDto;
//     return await this.orderService.declineOrder(username, productId);
//   }
// }

// import { Body, Controller, Post } from '@nestjs/common';
// import { OrderService } from './order.service';
// import { OrderDecisionDto } from './dto/Order.dto';

// @Controller('order')
// export class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Post('accept')
//   async acceptOrder(@Body() orderDecisionDto: OrderDecisionDto) {
//     const { username, productId } = orderDecisionDto;
//     return await this.orderService.acceptOrder(username, productId);
//   }

//   @Post('decline')
//   async declineOrder(@Body() orderDecisionDto: OrderDecisionDto) {
//     const { username, productId } = orderDecisionDto;
//     return await this.orderService.declineOrder(username, productId);
//   }
// }

import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDecisionDto } from './dto/Order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('accept')
  async acceptOrder(@Body() orderDecisionDto: OrderDecisionDto) {
    const { username, productId } = orderDecisionDto;
    return await this.orderService.acceptOrder(username, productId);
  }

  @Post('decline')
  async declineOrder(@Body() orderDecisionDto: OrderDecisionDto) {
    const { username, productId } = orderDecisionDto;
    return await this.orderService.declineOrder(username, productId);
  }
}
