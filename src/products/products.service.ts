import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Products from '../entities/products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import userGuard from 'src/users/dto/userGuard';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  /**
   * Create a new product and assign it to the current user
   */
  async create(createProductDto: CreateProductDto) {
    return await this.productsRepository.save(createProductDto);
  }

  /**
   * Get all products including their user relation
   */
  async findAll() {
    return this.productsRepository.find({
      relations: { user: true },
    });
  }

  /**
   * Get a single product by ID
   * Throws 404 if not found
   */
  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      relations: { user: true },
      where: { id },
    });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return product;
  }

  /**
   * Update a product if it belongs to the logged-in user
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    const result = await this.productsRepository.update(
      { id, user: updateProductDto.user }, // ensure ownership
      { ...updateProductDto },
    );

    if (result.affected === 0) {
      throw new HttpException('Product not found or not authorized', 404);
    }

    return { message: 'Product updated successfully' };
  }

  /**
   * Remove a product if it belongs to the logged-in user
   */
  async remove(id: number, user: userGuard) {
    const product = await this.productsRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.user', 'users')
      .where('products.id = :id', { id })
      .andWhere('users.id = :userId', { userId: user.id }) // match logged-in user
      .getOne();

    if (!product) {
      throw new HttpException('Product not found or not authorized', 404);
    }

    await this.productsRepository.remove(product);
    return { message: 'Product removed successfully' };
  }
}
