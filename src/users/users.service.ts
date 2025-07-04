import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: '$2a$10$FdoDPFtimpT7C4NYoitwku59QrxixgTgYNLid8zIr.8Ge1oMh0yKC',
    },
    {
      id: 2,
      username: 'user',
      password: '$2a$10$b0azPzTLj4WfttZ4mIZQ8Os77G2swpMhxmSC2NLWVcVqkIKOf2qPO',
    },
  ];

  findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  findById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
