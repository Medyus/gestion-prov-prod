import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductAlreadyExistsException } from '../../common/exceptions/product-already-exists';
import { ProductNotFoundException } from '../../common/exceptions/product-not-found';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProvidersService } from '../providers/providers.service';
import { ProductNotDeletedException } from '../../common/exceptions/product-not-deleted';
import { ProductNotValidException } from '../../common/exceptions/product-not-valid';

enum typeProduct {
  'electronico',
  'ropa',
  'alimentos',
  'herramientas',
  'juguetes',
}

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
    const { productDto, result } = await this.checkUpdate(createProductDto);
    createProductDto = productDto;
    const create = new this.productModel({ ...createProductDto });
    const prod = await create.save();
    return { message: 'Producto guardado', providers_check: result, insert: prod };
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async updateById(id, updateProductDto: UpdateProductDto): Promise<Object> {
    let { productDto, result } = { productDto: null, result: [] };
    // Se valida el enum a mano, por que no toma en cuenta el enum al usar partialtype
    if (updateProductDto.type && !(updateProductDto.type in typeProduct)) {
      throw new ProductNotValidException();
    }
    const productFind = await this.findProductById(id);
    if (updateProductDto.providers && updateProductDto.providers.length > 0) {
      ({ productDto, result } = await this.checkUpdate(updateProductDto));
      updateProductDto.providers = productDto.providers;
    }
    const product = await this.productModel.findByIdAndUpdate(productFind.id, { ...updateProductDto }, { new: true }).exec();
    return { message: 'Producto Modificado', providers_check: result, update: product };
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

  async deleteById(id: string): Promise<void | Object> {
    const product = await this.findProductById(id);
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return result ? { message: 'Producto borrado' } : new ProductNotDeletedException();
  }

  async checkUpdate(productDto: any) {
    const result = [];
    const add = [];
    if (productDto.providers.length > 0) {
      for (let i = 0; i < productDto.providers.length; i++) {
        let provider = productDto.providers[i];
        const providerFind = await this.providersService.findByName(provider);
        if (providerFind != null) {
          if (!add.includes(provider)) {
            result.push({ provider: providerFind.name, result: 'Proveedor agregado' });
            add.push(providerFind.name);
          } else {
            result.push({ provider: providerFind.name, result: 'Proveedor repetido' });
            productDto.providers.splice(i, 1);
            i--;
          }
        } else {
          result.push({ provider: provider, result: 'Proveedor no existe' });
          productDto.providers.splice(i, 1);
          i--;
        }
      }
    }
    return { productDto, result };
  }
}
