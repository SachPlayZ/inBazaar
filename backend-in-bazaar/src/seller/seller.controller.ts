import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/Seller.dto';
import { SellerLoginDto } from './dto/Login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/Product.dto';

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

  @UseGuards(JwtAuthGuard)
  @Get('/dashboard-stats')
  async getDashboardStats(@Request() req) {
    const sellerId = await this.sellerService.getSellerId(req.user.id);
    return await this.sellerService.getDashboardStats(sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/recent-products')
  async getRecentProducts(@Request() req) {
    const sellerId = await this.sellerService.getSellerId(req.user.id);
    return await this.sellerService.getRecentProducts(sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getSellerDetails(@Request() req) {
    const sellerId = await this.sellerService.getSellerId(req.user.id);
    return await this.sellerService.getSellerDetails(sellerId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/products')
  async createProduct(@Request() req, @Body() productData: CreateProductDto) {
    const sellerId = await this.sellerService.getSellerId(req.user.id);
    return await this.sellerService.createProduct(sellerId, productData);
  }

  @Get('category/:name')
  async getCategoryByName(@Param('name') name: string) {
    const category = await this.sellerService.getCategoryByName(name);
    return category;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/inventory')
  async getSellerProducts(@Request() req) {
    const sellerId = await this.sellerService.getSellerId(req.user.id);
    return await this.sellerService.getSellerProducts(sellerId);
  }
}
