import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly user_repository: Repository<Users>,
  ) {}

  findUserByEmail = async (email: string) => {
    return await this.user_repository.findOne({ where: { email } });
  };
  findAll = async () => {
    return await this.user_repository.find();
  };
  createUser = async (data: CreateUserDto) => {
    const user = await this.user_repository.create(data);
    this.user_repository.save(user);
    return user;
  };
  findUserById(id: number) {
    return { id, name: 'John Doe', username: 'johndoe' };
  }

  findUserByUsername(username: string) {
    return { id: 1, name: 'John Doe', username };
  }
}
