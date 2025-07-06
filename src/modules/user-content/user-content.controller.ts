import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserContentDto } from './dto/create-user-content.dto';
import { UpdateUserContentDto } from './dto/update-user-content.dto';
import { UserContentService } from './user-content.service';

@Controller('user-content')
export class UserContentController {
  constructor(private readonly userContentService: UserContentService) {}

  @Post()
  create(@Body() createUserContentDto: CreateUserContentDto) {
    return this.userContentService.create(createUserContentDto);
  }

  @Get()
  findAll() {
    return this.userContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userContentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserContentDto: UpdateUserContentDto,
  ) {
    return this.userContentService.update(+id, updateUserContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userContentService.remove(+id);
  }
}
