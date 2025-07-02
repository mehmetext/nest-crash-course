import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(dto: CreateProductDto): Product {
    const newProduct = {
      id: Date.now().toString(),
      ...dto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
