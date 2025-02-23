import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
  MaxLength,
} from 'class-validator';

export enum CategoryType {
  Fashion = 'Fashion',
  Groceries = 'Groceries',
  Electronics = 'Electronics',
  Kids = 'Kids',
}

export class CreateProductDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsUrl()
  url: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MaxLength(20)
  measuringUnit: string;

  @IsNumber()
  @Min(0)
  stoploss: number;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
