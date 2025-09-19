// import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

// export class LoginAuthDto {
//   @IsEmail()
//   email: string;
//   // @IsNotEmpty()
//   // password: string;
//   @IsOptional()
//   code: number;
// }
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  ValidateIf,
  IsNumber,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginAuthDto {
  // required email
  @IsEmail({}, { message: i18nValidationMessage('forms.validation.email') })
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Email',
    }),
  })
  email: string;

  // // password required iff no code
  // @ValidateIf((o) => !o.code)
  // @IsString()
  // @IsNotEmpty({
  //   message: i18nValidationMessage('forms.validation.required', {
  //     field: 'Password',
  //   }),
  // })
  // @MinLength(8, {
  //   message: i18nValidationMessage('forms.validation.minLength', {
  //     field: 'Password',
  //     min: 8,
  //   }),
  // })
  // password?: string;

  // 6-digit OTP required iff no password (string to keep leading zeros)
  // @ValidateIf((o) => !o.password)
  @IsOptional()
  @IsNumber()
  @IsNotEmpty({
    message: i18nValidationMessage('forms.validation.required', {
      field: 'Code',
    }),
  })
  code: number;
}
