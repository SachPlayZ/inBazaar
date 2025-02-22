import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // POST /category - Create a new category (or return existing one if slug exists)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  // GET /category - Get list of all categories
  @Get()
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  // GET /category/:id - Get a category by id along with its products
  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    return await this.categoryService.getCategoryById(id);
  }
}
