import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: User, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  getUsers(@Query('name') name?: string): User[] {
    return this.usersService.findAll(name);
  }

  @ApiOkResponse({ type: User })
  @Get(':id')
  getUser(@Param('id') id: string): User {
    return this.usersService.findById(+id);
  }

  @ApiCreatedResponse({ type: User })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.createUser(createUserDto);
  }
}
