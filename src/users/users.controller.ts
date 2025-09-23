import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()            // ← shows Bearer auth in Swagger
@UseGuards(JwtAuthGuard)    // ← guard all routes in this controller
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /** List users (localized message) */
  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ description: 'Users list retrieved successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  async findAll(@I18n() i18n: I18nContext) {
    const data = await this.userService.findAll();
    return { message: i18n.t('tr.users.title'), data }; // e.g., "Users"
  }
}
