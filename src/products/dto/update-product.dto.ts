import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * UpdateProductDto
 * Inherits all fields & validations from CreateProductDto
 * but makes them optional (so user can update only one field if needed)
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
