import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import userGuard from 'src/users/dto/userGuard';

export class CreateProductDto {
  /**
   * Product title
   * Required, must be a string
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * Product description
   * Required, must be a string with at least 10 characters
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  /**
   * Product price
   * Optional, must be a number if provided
   */
  @IsNumber()
  @IsOptional()
  price?: number;

  /**
   * User who creates the product
   * Optional, injected from request.user (not from client input!)
   */
  @IsOptional()
  user?: userGuard;
}
