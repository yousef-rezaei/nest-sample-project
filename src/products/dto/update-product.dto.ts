import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// Fields become optional; i18n messages from CreateProductDto still apply.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
