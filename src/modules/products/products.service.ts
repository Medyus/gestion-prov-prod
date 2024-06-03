import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductAlreadyExistsException } from 'src/common/exceptions/product-already-exists';
import { ProductNotFoundException } from 'src/common/exceptions/product-not-found';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto) {
    const productFind = await this.productModel.findOne({ name: createProductDto.name }).exec();
    if (productFind) {
      throw new ProductAlreadyExistsException();
    }
    // TODO: comprobar si trae proveedores, si es asi comprobar existencia
    const create = new this.productModel({ ...createProductDto});
    return create.save();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async updateById(id, updateProductDto: UpdateProductDto): Promise<Object> {
    const productFind = await this.findProductById(id);
    const product = await this.productModel.findByIdAndUpdate(productFind.id, { ...updateProductDto }, { new: true }).exec();
    return { message: 'Producto Modificado', product };
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new ProductNotFoundException();
    }
    return product;
  }
}
