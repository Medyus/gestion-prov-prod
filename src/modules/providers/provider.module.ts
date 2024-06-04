import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider, ProviderSchema } from './schema/provider.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Provider.name, schema: ProviderSchema}]),
    forwardRef(() => ProductsModule)
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService]
})
export class ProvidersModule {}
