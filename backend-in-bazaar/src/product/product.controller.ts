import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // GET /product/all - Retrieve all products
  @Get('/all')
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  // GET /product/:categorySlug - Retrieve products by category slug (optional)
  @Get('/:categorySlug')
  async getCategorisedProducts(@Param('categorySlug') categorySlug: string) {
    return await this.productService.getCategorisedProducts(categorySlug);
  }

  // POST /product/allot - Seller lists a new product
  @Post('/allot')
  async sellProduct(
    @Body()
    productData: {
      name: string;
      url: string;
      description: string;
      price: number;
      measuringUnit: string; // Now required
      stoploss: number;
      sellerUsername: string;
      categoryId?: string;
    },
  ) {
    return await this.productService.sellProduct(productData);
  }

  // GET /product/search?name=someName
  @Get('/search/:name')
  async searchProduct(@Param('name') name: string) {
    return await this.productService.findProductByName(name);
  }
}
