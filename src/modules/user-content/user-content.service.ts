import { Injectable } from '@nestjs/common';
import { CreateUserContentDto } from './dto/create-user-content.dto';
import { UpdateUserContentDto } from './dto/update-user-content.dto';

@Injectable()
export class UserContentService {
  create(dto: CreateUserContentDto) {
    console.log(dto);
    return 'This action adds a new userContent';
  }

  findAll() {
    return `This action returns all userContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userContent`;
  }

  update(id: number, dto: UpdateUserContentDto) {
    console.log(id, dto);
    return `This action updates a #${id} userContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} userContent`;
  }
}
