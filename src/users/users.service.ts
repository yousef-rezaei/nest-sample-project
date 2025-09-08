import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
  findUserById(id: number) {
    return { id, name: 'John Doe', username: 'johndoe' };
  }

  findUserByUsername(username: string) {
    return { id: 1, name: 'John Doe', username };
  }
}
