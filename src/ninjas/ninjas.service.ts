import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';

@Injectable()
export class NinjasService {
  private ninjas: CreateNinjaDto[] = [
    { id: 0, name: 'ninjaA', weapon: 'stars' },
    { id: 1, name: 'ninjaB', weapon: 'nunchuks' },
  ];

  getNinjas(weapon?: 'stars' | 'nunchuks') {
    if (weapon) {
      return this.ninjas.filter((n) => n.weapon === weapon);
    }
    return this.ninjas;
  }

  getNinja(id: number) {
    const ninja = this.ninjas.find((n) => n.id === id);
    if (!ninja) {
      throw new Error('ninja not found');
    }
    return ninja;
  }

  createNinja(createNinjaDto: CreateNinjaDto) {
    createNinjaDto.id = Date.now();
    this.ninjas.push(createNinjaDto);
    return createNinjaDto;
  }

  updateNinja(id: number, updateNinjaDto: UpdateNinjaDto) {
    this.ninjas = this.ninjas.map((n) => {
      if (n.id === id) {
        n = { ...n, ...updateNinjaDto };
      }

      return n;
    });

    return this.getNinja(id);
  }

  removeNinja(id: number) {
    let toBeRemoved: CreateNinjaDto;

    this.ninjas = this.ninjas.filter((n) => {
      if (n.id === id) toBeRemoved = n;

      return n.id !== id;
    });

    return toBeRemoved;
  }
}
