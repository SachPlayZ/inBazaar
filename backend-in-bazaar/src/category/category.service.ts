import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Creates a new category only if one with the same slug doesn't exist.
  async createCategory(data: CreateCategoryDto) {
    // Check if a category with the given slug exists
    const existing = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return existing; // Return existing category instead of creating a new one.
    }

    return await this.prisma.category.create({
      data: {
        type: data.type,
        slug: data.slug,
      },
    });
  }

  // Returns all categories
  async getCategories() {
    return await this.prisma.category.findMany();
  }

  // Returns a single category by id including its products.
  async getCategoryById(id: string) {
    return await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  // Add this new method
  async getCategoryBySlug(slug: string) {
    return await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            seller: true,
          },
        },
      },
    });
  }
}
