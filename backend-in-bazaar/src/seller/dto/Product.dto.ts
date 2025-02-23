import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

export enum CategoryType {
  Fashion = 'Fashion',
  Groceries = 'Groceries',
  Electronics = 'Electronics',
  Kids = 'Kids',
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  measuringUnit: string;

  @IsNumber()
  @Min(0)
  stoploss: number;

  @IsString()
  categoryId?: string;
}
