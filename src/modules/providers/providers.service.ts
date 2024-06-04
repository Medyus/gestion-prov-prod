import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { Provider } from './schema/provider.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProviderAlreadyExistsException } from 'src/common/exceptions/provider-already-exists';
import { ProviderNotFoundException } from 'src/common/exceptions/provider-not-found';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(Provider.name) private readonly providerModel: Model<Provider>,
    @Inject(forwardRef(() => ProductsService)) private productsService: ProductsService
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    const providerFind = await this.providerModel.findOne({ name: createProviderDto.name }).exec();
    if (providerFind) {
      throw new ProviderAlreadyExistsException();
    }

    const result = [];
    const add = [];
    if (createProviderDto.products.length > 0) {
      createProviderDto.products.forEach(async (product, index) => {
        const productFind = await this.productsService.findByName(product);
        if (productFind) {
          result.push({ product: productFind.name, message: 'Producto agregado' });
          add.push(product);
        } else {
          result.push({ product: product, message: 'Producto no existe' });
          createProviderDto.products.splice(index, 1);
        }
      });
    }
    const create = new this.providerModel({ ...createProviderDto });
    await create.save();
    return result;
  }

  async findAll(): Promise<Provider[]> {
    const providers = await this.providerModel.find().exec();
    return providers;
  }

  async updateById(id, updateProviderDto: UpdateProviderDto): Promise<Object> {
    const providerFind = await this.findProviderById(id);
    const provider = await this.providerModel.findByIdAndUpdate(providerFind.id, { ...updateProviderDto }, { new: true }).exec();
    return { message: 'Proveedor Modificado', provider };
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
}
