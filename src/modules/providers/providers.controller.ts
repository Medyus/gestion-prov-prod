import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProvidersService } from './providers.service';
import { Provider } from './schema/provider.schema';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Controller('providers')
export class ProvidersController {
    constructor(private readonly providerService: ProvidersService) {}

    // @UseGuards(JwtAuthGuard)
   @Post()
   create(@Body() createProviderDto: CreateProviderDto) {
     return this.providerService.create(createProviderDto);
   }
 
    // @UseGuards(JwtAuthGuard)
   @Get()
   async findAll(): Promise<Provider[]> {
     return await this.providerService.findAll();
   }
 
   // @UseGuards(JwtAuthGuard)
   @Patch('update/:id')
   updateById(@Param('id') id, @Body() updateProviderDto: UpdateProviderDto): Promise<Object> {
     console.log('updateById', id);
     return this.providerService.updateById(id, updateProviderDto);
   }
}
