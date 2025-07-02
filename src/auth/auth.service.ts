import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;

    const payload = { sub: user.id, user: rest };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async me() {}
}
