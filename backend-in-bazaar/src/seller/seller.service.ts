import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateSellerDto } from './dto/Seller.dto';
import { SellerLoginDto } from './dto/Login.dto';
import { JwtService } from '@nestjs/jwt';

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
}
