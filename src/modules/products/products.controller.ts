import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  StandardParam,
  StandardParams,
  StandardResponse,
} from 'nest-standard-response';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@UseGuards(AuthGuard('jwt'))
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  @StandardResponse({
    isPaginated: true,
    isFiltered: true,
    filterableFields: ['name', 'price'],
  })
  findAll(@StandardParam() params: StandardParams) {
    const { products, count } = this.productsService.findAll(params);
    params.setPaginationInfo({ count });
    return products;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
