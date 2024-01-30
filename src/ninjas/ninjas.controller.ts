import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';
import { NinjasService } from './ninjas.service';
import { BeltGuard } from 'src/belt/belt.guard';
import { Ninja } from './entities/ninja.entity';

@Controller('ninjas')
export class NinjasController {
  constructor(private readonly ninjasService: NinjasService) {}

  @Get()
  getNinjas(@Query('weapon') weapon?: 'stars' | 'nunchuks' | 'all'): Ninja[] {
    weapon = weapon === 'all' ? undefined : weapon;
    return this.ninjasService.getNinjas(weapon);
  }

  @Get(':id')
  getNinja(@Param('id', ParseIntPipe) id: number): Ninja {
    try {
      return this.ninjasService.getNinja(id);
    } catch (err) {
      throw new NotFoundException();
    }
  }

  @Post()
  @UseGuards(BeltGuard)
  addNinja(@Body(ValidationPipe) createNinjaDto: CreateNinjaDto): Ninja {
    return this.ninjasService.createNinja(createNinjaDto);
  }

  @Put(':id')
  updateNinja(
    @Param('id') id: string,
    @Body() updateNinjaDto: UpdateNinjaDto,
  ): Ninja {
    return this.ninjasService.updateNinja(+id, updateNinjaDto);
  }

  @Delete(':id')
  removeNinja(@Param('id') id: string): Ninja {
    return this.ninjasService.removeNinja(+id);
  }
}
