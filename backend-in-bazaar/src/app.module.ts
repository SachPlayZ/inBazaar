import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { SellerModule } from './seller/seller.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { BargainModule } from './bargain/bargain.module';

@Module({
  imports: [UserModule, CategoryModule, ProductModule, SellerModule, CartModule, OrderModule, BargainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
