import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  // Use slug as a unique identifier (or you could use type directly)
  @IsEnum(CategoryType, {
    message:
      'Type must be one of: FashionMale, FashionFemale, Groceries, Furniture, Kids, SexToys',
  })
  type: CategoryType;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
