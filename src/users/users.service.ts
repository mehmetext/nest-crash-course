import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: '$2a$10$FdoDPFtimpT7C4NYoitwku59QrxixgTgYNLid8zIr.8Ge1oMh0yKC',
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      password: '$2a$10$b0azPzTLj4WfttZ4mIZQ8Os77G2swpMhxmSC2NLWVcVqkIKOf2qPO',
    },
  ];

  findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  findById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async createUser(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    if (
      this.users.find((user) => user.username === dto.username) ||
      this.users.find((user) => user.email === dto.email)
    ) {
      throw new BadRequestException('USERNAME_OR_EMAIL_ALREADY_EXISTS');
    }

    const addingUser = {
      id: this.users.length + 1,
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };

    this.users.push(addingUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = addingUser;

    return rest;
  }
}
