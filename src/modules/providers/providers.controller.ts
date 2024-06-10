import { Body, Controller, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ProvidersService } from './providers.service';
import { Provider } from './schema/provider.schema';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ErrorFilter } from '../../common/catch/error-filter';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('providers')
export class ProvidersController {
    constructor(private readonly providerService: ProvidersService) {}

   @UseGuards(JwtAuthGuard)
   @Post()
   @UseFilters(ErrorFilter)
   create(@Body() createProviderDto: CreateProviderDto) {
     return this.providerService.create(createProviderDto);
   }
 
   @UseGuards(JwtAuthGuard)
   @Get()
   async findAll(): Promise<Provider[]> {
     return await this.providerService.findAll();
   }
 
   @UseGuards(JwtAuthGuard)
   @Patch('update/:id')
   updateById(@Param('id') id, @Body() updateProviderDto: UpdateProviderDto): Promise<Object> {
     return this.providerService.updateById(id, updateProviderDto);
   }

   @UseGuards(JwtAuthGuard)
   @Get('delete/:id')
   deleteById(@Param('id') id): Promise<void | Object>{
     return this.providerService.deleteById(id);
   }
}
