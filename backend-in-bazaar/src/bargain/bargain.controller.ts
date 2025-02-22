import { Controller, Get, Post } from '@nestjs/common';

@Controller('/bargain')
export class BargainController {
  @Get('/scraped-price')
  get_bargain() {}

  @Post('/accept')
  accept_bargain() {
    //Should call out to the order accept model
  }

  @Post('/decline')
  decline_bargain() {}
}
