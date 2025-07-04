import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  findByEmailOrUsername(email: string, username: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    if (await this.findByEmailOrUsername(dto.email, dto.username)) {
      throw new BadRequestException('USERNAME_OR_EMAIL_ALREADY_EXISTS');
    }

    return this.prisma.user.create({
      data: {
        ...dto,
        password: await bcrypt.hash(dto.password, 10),
      },
    });
  }
}
