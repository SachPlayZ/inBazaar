import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [UserModule, CategoryModule, ProductModule, SellerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
