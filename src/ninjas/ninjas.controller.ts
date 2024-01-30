import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';

@Controller('ninjas')
export class NinjasController {
  @Get()
  getNinjas(@Query('type') type: string) {
    return [{ type }];
  }

  @Get(':id')
  getNinja(@Param('id') id: string) {
    return {
      id: id,
    };
  }

  @Post()
  addNinja(@Body() createNinjaDto: CreateNinjaDto) {
    return createNinjaDto;
  }

  @Put(':id')
  updateNinja(@Param('id') id: string, @Body() updateNinjaDto: UpdateNinjaDto) {
    return {
      id: id,
      ...updateNinjaDto,
    };
  }

  @Delete(':id')
  removeNinja(@Param('id') id: string) {
    return {
      id: id,
    };
  }
}
