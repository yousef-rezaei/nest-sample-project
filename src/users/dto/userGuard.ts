import { IsEmail, IsInt, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

// Minimal i18n-ready payload for the authenticated user
export default class userGuard {
  @IsInt({
    message: i18nValidationMessage('forms.validation.number', {
      field: 'User ID',
    }),
  })
  @Min(1, {
    message: i18nValidationMessage('forms.validation.min', {
      field: 'User ID',
      min: 1,
    }),
  })
  id: number;

  @IsEmail({}, { message: i18nValidationMessage('forms.validation.email') })
  email: string;
}
