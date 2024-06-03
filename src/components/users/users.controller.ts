import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':email')
  deleteByEmail(@Param('email') params) {
    console.log('deleteByEmail', params);
    return this.usersService.deleteByEmail(params.email);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.usersService.findAll();
  }

  @Get('find/:id')
  async findOne(@Param('id') id) {
    console.log('findOne', id);
    return this.usersService.findOne(id);
  }
  
  @Get('delete/:id')
  deleteById(@Param('id') id) {
    console.log('deleteById', id);
    return this.usersService.deleteById(id);
  }
}
