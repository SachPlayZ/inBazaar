import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateSellerDto } from './dto/Seller.dto';
import { SellerLoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateProductDto } from './dto/Product.dto';
import { CategoryType } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(createSellerDto: CreateSellerDto) {
    const { name, shopName, email, username, password } = createSellerDto;

    // Check if a user already exists with this email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with role SELLER and provided username
    const user = await this.prisma.user.create({
      data: {
        firstname: name,
        username,
        email,
        hash_password: hashedPassword,
        role: 'SELLER',
      },
    });

    // Create the seller record linked to the newly created user
    const seller = await this.prisma.seller.create({
      data: {
        shopName,
        user: { connect: { id: user.id } },
      },
    });

    // Automatically log in the seller by generating a JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { seller, token };
  }

  async login(sellerLoginDto: SellerLoginDto) {
    const { email, password } = sellerLoginDto;

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Check if the user exists and has a seller role
    if (!user || user.role !== 'SELLER') {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.hash_password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create a JWT payload. Adjust fields as needed.
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { accessToken: token };
  }

  async getDashboardStats(sellerId: string) {
    // Get basic stats that we can reliably calculate
    const products = await this.prisma.product.findMany({
      where: { sellerId },
    });

    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, product) => sum + product.price,
      0,
    );

    return {
      totalProducts,
      totalValue,
      averagePrice: totalProducts > 0 ? totalValue / totalProducts : 0,
    };
  }

  async getRecentProducts(sellerId: string) {
    return await this.prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        Category: true,
      },
    });
  }

  async getSellerId(userId: string): Promise<string> {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    return seller.id;
  }

  async getSellerDetails(sellerId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      include: {
        user: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return {
      id: seller.id,
      name: seller.user.firstname,
      email: seller.user.email,
      username: seller.user.username,
      shopName: seller.shopName,
      totalProducts: seller._count.products,
    };
  }

  async createProduct(sellerId: string, productData: CreateProductDto) {
    try {
      // Verify category if provided
      if (productData.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: productData.categoryId },
        });
        if (!category) {
          throw new NotFoundException('Category not found');
        }
      }

      // Validate seller exists
      const seller = await this.prisma.seller.findUnique({
        where: { id: sellerId },
        include: { user: true },
      });

      if (!seller) {
        throw new NotFoundException('Seller not found');
      }

      const product = await this.prisma.product.create({
        data: {
          name: productData.name,
          url: productData.url,
          description: productData.description,
          price: productData.price,
          measuringUnit: productData.measuringUnit,
          stoploss: productData.stoploss,
          seller: { connect: { id: sellerId } },
          Category: productData.categoryId
            ? { connect: { id: productData.categoryId } }
            : undefined,
        },
        include: {
          Category: true,
        },
      });

      return {
        ...product,
        seller: {
          id: seller.id,
          name: seller.user.firstname,
          shopName: seller.shopName,
        },
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Product already exists');
      }
      throw error;
    }
  }

  async getCategoryByName(categoryType: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        type: categoryType as CategoryType,
      },
      select: {
        id: true,
        type: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category "${categoryType}" not found`);
    }

    return category;
  }

  async getSellerProducts(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId: sellerId,
      },
      include: {
        Category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  }
}
