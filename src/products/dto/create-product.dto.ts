import {
  ApiProperty,
  ApiPropertyOptional,
  ApiHideProperty,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import userGuard from 'src/users/dto/userGuard';
import { Type } from 'class-transformer';

export class CreateProductDto {
  // required string
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Title',
    }),
  })
  @ApiProperty({
    description: 'The title of the product',
    minLength: 10,
    maxLength: 50,
    example: 'Stainless Steel Water Bottle',
    default: '',
  })
  title: string;

  // required string, min length 10
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Description',
    }),
  })
  @MinLength(10, {
    message: i18nValidationMessage('forms.validation.minLength', {
      field: 'Description',
      min: 10,
    }),
  })
  @ApiProperty({
    description: 'Detailed description of the product',
    minLength: 10,
    maxLength: 500,
    example:
      'Double-walled, BPA-free 750 ml bottle that keeps drinks cold for 24h and hot for 12h.',
    default: '',
  })
  description: string;

  // optional number
  @Type(() => Number)
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('forms.validation.number', {
        field: 'Price',
      }),
    },
  )
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Unit price (e.g., in EUR)',
    type: Number,
    minimum: 0,
    example: 19.99,
    nullable: true,
  })
  price?: number;

  // optional, injected from request.user (not client input)
  @IsOptional()
  @ApiHideProperty() // hide from Swagger; it’s not provided by clients
  user?: userGuard;
}
