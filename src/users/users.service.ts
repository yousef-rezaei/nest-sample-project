import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly user_repository: Repository<Users>,
  ) {}
  findAll = async () => {
    return await this.user_repository.find();
  };
  findUserById(id: number) {
    return { id, name: 'John Doe', username: 'johndoe' };
  }

  findUserByUsername(username: string) {
    return { id: 1, name: 'John Doe', username };
  }
}
