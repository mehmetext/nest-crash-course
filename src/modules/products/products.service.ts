import { Injectable } from '@nestjs/common';
import { StandardParams } from 'nest-standard-response';
import { PRODUCTS } from 'src/common/constants/products';
import { filterEntities, FilterType } from 'src/common/utils/filter-entities';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = PRODUCTS;

  create(dto: CreateProductDto): Product {
    const newProduct = {
      id: Date.now().toString(),
      ...dto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  findAll(params: StandardParams): { products: Product[]; count: number } {
    const { paginationInfo, filteringInfo } = params;
    const { limit, offset } = paginationInfo;
    const { filter } = filteringInfo;

    const filteredProducts = filterEntities(
      this.products,
      filter as FilterType<Product>,
    );

    return {
      products: filteredProducts.slice(offset, offset + limit),
      count: filteredProducts.length,
    };
  }

  findOne(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
