import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { I18n, I18nContext } from 'nestjs-i18n'; // ← i18n context

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterAuthDto, @I18n() i18n: I18nContext) {
    const user = await this.authService.register(dto);
    return { message: i18n.t('tr.auth.register.success'), data: user }; // ← localized
  }

  @Post('login')
  async login(@Body() dto: LoginAuthDto, @I18n() i18n: I18nContext) {
    const result = await this.authService.login(dto);
    // return { message: i18n.t('tr.auth.login.success'), ...result }; // ← localized
    return { ...result, message: i18n.t('tr.auth.login.success') };
  }
}
