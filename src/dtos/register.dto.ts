import { IsEmail, IsString, MinLength, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  fullName: string;

  @IsDateString()
  birthDate: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
} 