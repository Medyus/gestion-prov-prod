import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserNotDeletedException } from '../../common/exceptions/user-not-deleted';
import { EmailAlreadyExistsException } from '../../common/exceptions/email-already-exists';
import { EmailNotFoundException } from '../../common/exceptions/email-not-found';
import { UserNotFoundException } from '../../common/exceptions/user-not-found';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = new this.userModel({ ...userData, password: hashedPassword });
    return createUser.save();
  }

  async deleteByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new EmailNotFoundException();
    }
    return await this.deleteUserById(user.id);
  }

  async deleteById(id: string) {
    const user = await this.findUserById(id);
    return await this.deleteUserById(user.id);
  }

  async updateUser() {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().select('-password').exec();
    return users;
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.findUserById(id);
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    console.log('findUserById', user);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async deleteUserById(id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return result ? { message: 'Usuario borrado' } : new UserNotDeletedException();
  }
}
