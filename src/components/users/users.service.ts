import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new Error(); // colocar error de persona encontrada
    }
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new this.userModel({ ...userData, password: hashedPassword });
    return createUser.save();
  }

  async deleteByEmail(email: string) {
    const user = await this.userModel.findOne({email}).exec();
    if(!user) {
      throw new Error(); // colocar error de persona no encontrada
    }
    const result = await this.userModel.findByIdAndDelete(user.id).exec();
    return result ? { message: 'Usuario borrado' } : Error(); // colocar error de persona no borrada ?
  }

  async updateUser() {}
}
