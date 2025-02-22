import { Body, Controller, Post } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/Seller.dto';
import { SellerLoginDto } from './dto/Login.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // POST /seller/signup
  @Post('/signup')
  async signup(@Body() createSellerDto: CreateSellerDto) {
    return await this.sellerService.signup(createSellerDto);
  }

  @Post('/login')
  async login(@Body() sellerLoginDto: SellerLoginDto) {
    return await this.sellerService.login(sellerLoginDto);
  }
}
