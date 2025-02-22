import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SellerLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
