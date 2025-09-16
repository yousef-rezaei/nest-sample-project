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
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import userGuard from 'src/users/dto/userGuard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Create a new product (auth required)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    const user: userGuard = req.user;
    createProductDto.user = user;
    return this.productsService.create(createProductDto);
  }

  /**
   * Get all products
   */
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  /**
   * Get one product by ID
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * Update a product (auth required)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    updateProductDto.user = req.user;
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Delete a product (auth required)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number, @Request() req) {
    const user: userGuard = req.user;
    return this.productsService.remove(id, user);
  }
}
