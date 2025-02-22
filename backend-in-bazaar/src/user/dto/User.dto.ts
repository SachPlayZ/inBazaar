import {
    IsEmail,
    Matches,
    MaxLength,
    MinLength,
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  export enum Role {
    BUYER = 'BUYER',
    SELLER = 'SELLER',
  }
  
  export class UserDTO {
    @MaxLength(20)
    firstname: string;
  
    @MaxLength(20)
    lastname: string;
  
    @MinLength(3)
    @MaxLength(20)
    username: string;
  
    @IsEmail()
    email: string;
  
    @MinLength(8)
    @MaxLength(128)
    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
      message:
        'Password must contain at least 1 upper case letter, 1 number, and 1 special character',
    })
    hash_password: string;
  
    @MaxLength(264)
    address: string;
  
    @MaxLength(10)
    contact_number: string;
  
    // Optional role; if not provided, the service will default to BUYER.
    @IsOptional()
    @IsEnum(Role, { message: 'Role must be either BUYER or SELLER' })
    role?: Role;
  }
  