import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class CreateUserDto {
  // required email
  @IsEmail({}, { message: i18nValidationMessage('forms.validation.email') })
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Email',
    }),
  })
  email: string;

  // required string (min 2)
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'First name',
    }),
  })
  @MinLength(2, {
    message: i18nValidationMessage('forms.validation.minLength', {
      field: 'First name',
      min: 2,
    }),
  })
  first_name: string;

  // required string (min 2)
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Last name',
    }),
  })
  @MinLength(2, {
    message: i18nValidationMessage('forms.validation.minLength', {
      field: 'Last name',
      min: 2,
    }),
  })
  last_name: string;

  // optional number (0+)
  @IsOptional()
  @Type(() => Number) // if transform=true
  @IsNumber(
    {},
    {
      message: i18nValidationMessage('forms.validation.number', {
        field: 'Age',
      }),
    },
  )
  @Min(0, {
    message: i18nValidationMessage('forms.validation.min', {
      field: 'Age',
      min: 0,
    }),
  })
  age?: number;

  // required string (min 8)
  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Password',
    }),
  })
  @MinLength(8, {
    message: i18nValidationMessage('forms.validation.minLength', {
      field: 'Password',
      min: 8,
    }),
  })
  password: string;
}
