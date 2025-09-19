import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  HttpException,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import userGuard from 'src/users/dto/userGuard';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /** Create (auth) */
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @I18n() i18n: I18nContext,
  ) {
    const user: userGuard = req.user;
    createProductDto.user = user;
    const data = await this.productsService.create(createProductDto);
    return { message: i18n.t('tr.products.created'), data };
  }

  /** Get all */
  @Get()
  async findAll(@I18n() i18n: I18nContext) {
    const data = await this.productsService.findAll();
    return { message: i18n.t('tr.products.list'), data };
  }

  /** Get by ID */
  @Get(':id')
  async findOne(@Param('id') id: number, @I18n() i18n: I18nContext) {
    const data = await this.productsService.findOne(id);
    if (!data) throw new HttpException(i18n.t('tr.products.notFound'), 404);
    return data;
  }

  /** Update (auth) */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
    @I18n() i18n: I18nContext,
  ) {
    updateProductDto.user = req.user;
    const data = await this.productsService.update(id, updateProductDto);
    return { message: i18n.t('tr.products.updated'), data };
  }

  /** Delete (auth) */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: number,
    @Request() req,
    @I18n() i18n: I18nContext,
  ) {
    const user: userGuard = req.user;
    await this.productsService.remove(id, user);
    return { message: i18n.t('tr.products.deleted') };
  }
}
