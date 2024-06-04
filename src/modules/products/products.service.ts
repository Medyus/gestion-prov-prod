import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductAlreadyExistsException } from 'src/common/exceptions/product-already-exists';
import { ProductNotFoundException } from 'src/common/exceptions/product-not-found';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProvidersService } from '../providers/providers.service';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @Inject(forwardRef(() => ProvidersService)) private providersService: ProvidersService
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productFind = await this.productModel.findOne({ name: createProductDto.name }).exec();
    if (productFind) {
      throw new ProductAlreadyExistsException();
    }

    const result = [];
    const add = [];
    if (createProductDto.providers.length > 0) {
      createProductDto.providers.forEach(async (provider, index) => {
        const providerFind = await this.providersService.findByName(provider);
        if (providerFind) {
          result.push({ provider: providerFind.name, message: 'Proveedor agregado' });
          add.push(provider);
        } else {
          result.push({ provider: provider, message: 'Proveedor no existe' });
          createProductDto.providers.splice(index, 1);
        }
      });
    }
    const create = new this.productModel({ ...createProductDto });
    await create.save();
    return result;
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

  async findByName(name: string): Promise<Product> {
    const product = await this.productModel.findOne({ name: name }).exec();
    return product;
  }
}
