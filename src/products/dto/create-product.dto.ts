import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import userGuard from 'src/users/dto/userGuard';

export class CreateProductDto {
  // required string
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Title',
    }),
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
  description: string;

  // optional number
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('forms.validation.number', {
        field: 'Price',
      }),
    },
  )
  @IsOptional()
  price?: number;

  // optional, injected from request.user (not client input)
  @IsOptional()
  user?: userGuard;
}
