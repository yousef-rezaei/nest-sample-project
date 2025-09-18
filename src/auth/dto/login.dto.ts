import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;
  // @IsNotEmpty()
  // password: string;
  @IsOptional()
  code: number;
}
