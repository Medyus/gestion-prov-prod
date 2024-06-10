import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async findOne(@Param('id') id): Promise<Omit<User, 'password'>> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':email')
  deleteByEmail(@Param('email') params): Promise<void | Object>{
    return this.usersService.deleteByEmail(params.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('delete/:id')
  deleteById(@Param('id') id): Promise<void | Object>{
    return this.usersService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  updateById(@Param('id') id, @Body() updateUserDto: UpdateUserDto): Promise<Object> {
    return this.usersService.updateById(id, updateUserDto);
  }
}
