import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /** list users (localized message) */
  @Get()
  async findAll(@I18n() i18n: I18nContext) {
    const data = await this.userService.findAll();
    return { message: i18n.t('tr.users.title'), data }; // e.g., "Users"
  }
}
