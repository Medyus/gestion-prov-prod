import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Provider } from './schema/provider.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderAlreadyExistsException } from '../../common/exceptions/provider-already-exists';
import { ProviderNotFoundException } from '../../common/exceptions/provider-not-found';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProductsService } from '../products/products.service';
import { ProviderNotDeletedException } from '../../common/exceptions/provider-not-deleted';
import { ProviderNotValidException } from '../../common/exceptions/provider-not-valid';

enum typeProvider {
  'mayorista',
  'minorista',
  'distribuidor',
  'fabricante',
}

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
    @Inject(forwardRef(() => ProductsService)) private productsService: ProductsService
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    const productFind = await this.providerModel.findOne({ name: createProviderDto.name }).exec();
    if (productFind) {
      throw new ProviderAlreadyExistsException();
    }
    const { providerDto, result } = await this.checkUpdate(createProviderDto);
    createProviderDto = providerDto;
    const create = new this.providerModel({ ...createProviderDto });
    const prov = await create.save();
    return { message: 'Proveedor guardado', providers: result, insert: prov };
  }

  async findAll(): Promise<Provider[]> {
    const providers = await this.providerModel.find().exec();
    return providers;
  }

  async updateById(id, updateProviderDto: UpdateProviderDto): Promise<Object> {
    let { providerDto, result } = { providerDto: null, result: [] };
    // Se valida el enum a mano, por que no toma en cuenta el enum al usar partialtype
    if (updateProviderDto.type && !(updateProviderDto.type in typeProvider)) {
      throw new ProviderNotValidException();
    }
    const productFind = await this.findProviderById(id);
    if (updateProviderDto.products && updateProviderDto.products.length > 0) {
      ({ providerDto, result } = await this.checkUpdate(updateProviderDto));
      updateProviderDto.products = providerDto.products;
    }
    const provider = await this.providerModel.findByIdAndUpdate(productFind.id, { ...updateProviderDto }, { new: true }).exec();
    return { message: 'Proveedor Modificado', products_check: result, update: provider };
  }

  async findProviderById(id: string): Promise<Provider> {
    const provider = await this.providerModel.findById(id).exec();
    if (!provider) {
      throw new ProviderNotFoundException();
    }
    return provider;
  }

  async findByName(name: string): Promise<Provider> {
    const provider = await this.providerModel.findOne({ name: name }).exec();
    return provider;
  }

  async deleteById(id: string): Promise<void | Object> {
    const provider = await this.findProviderById(id);
    const result = await this.providerModel.findByIdAndDelete(id).exec();
    return result ? { message: 'Proveedor borrado' } : new ProviderNotDeletedException();
  }

  async checkUpdate(providerDto: any) {
    const result = [];
    const add = [];
    if (providerDto.products.length > 0) {
      for (let i = 0; i < providerDto.products.length; i++) {
        let product = providerDto.products[i];
        const productFind = await this.productsService.findByName(product);
        if (productFind != null) {
          if (!add.includes(product)) {
            result.push({ provider: productFind.name, result: 'Producto agregado' });
            add.push(productFind.name);
          } else {
            result.push({ provider: productFind.name, result: 'Producto repetido' });
            providerDto.products.splice(i, 1);
            i--;
          }
        } else {
          result.push({ product: product, result: 'Producto no existe' });
          providerDto.products.splice(i, 1);
          i--;
        }
      }
    }
    return { providerDto, result };
  }
}
