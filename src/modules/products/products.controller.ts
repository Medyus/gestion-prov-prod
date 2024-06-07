import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

   // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

   // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  updateById(@Param('id') id, @Body() updateProductDto: UpdateProductDto): Promise<Object> {
    console.log('updateById', id);
    return this.productsService.updateById(id, updateProductDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('delete/:id')
  deleteById(@Param('id') id): Promise<void | Object>{
    return this.productsService.deleteById(id);
  }
}
