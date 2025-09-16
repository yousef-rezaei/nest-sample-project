import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import Products from './entities/products.entity';

@Module({
  // Import the TypeORM repository for Products entity
  imports: [TypeOrmModule.forFeature([Products])],

  // Expose REST endpoints
  controllers: [ProductsController],

  // Business logic (CRUD operations)
  providers: [ProductsService],

  // Export the service in case another module (e.g., OrdersModule) needs it
  exports: [ProductsService],
})
export class ProductsModule {}
