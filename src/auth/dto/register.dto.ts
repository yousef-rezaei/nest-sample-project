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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterAuthDto {
  // required email
  @IsEmail({}, { message: i18nValidationMessage('forms.validation.email') })
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Email',
    }),
  })
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  // required first name
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
  @ApiProperty({
    description: 'First name of the user',
    minLength: 2,
    maxLength: 50,
    example: 'Yousef',
  })
  first_name: string;

  // required last name
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
  @ApiProperty({
    description: 'Last name of the user',
    minLength: 2,
    maxLength: 50,
    example: 'Rezaeimirghaed',
  })
  last_name: string;

  // optional age (>=0)
  @IsOptional()
  @Type(() => Number)
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
  @ApiPropertyOptional({
    description: 'Age in years (optional)',
    type: Number,
    minimum: 0,
    example: 28,
    nullable: true,
  })
  age?: number;

  // required password (>=8)
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
  @ApiProperty({
    description: 'Password (min 8 characters)',
    minLength: 8,
    example: 'Secret123!',
    format: 'password',
  })
  password: string;
}
