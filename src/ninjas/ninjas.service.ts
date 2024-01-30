import { Injectable } from '@nestjs/common';
import { CreateNinjaDto } from './dto/create-ninja.dto';
import { UpdateNinjaDto } from './dto/update-ninja.dto';
import { Ninja } from './entities/ninja.entity';

@Injectable()
export class NinjasService {
  private ninjas: Ninja[] = [
    { id: 0, name: 'ninjaA', weapon: 'stars' },
    { id: 1, name: 'ninjaB', weapon: 'nunchuks' },
  ];

  getNinjas(weapon?: 'stars' | 'nunchuks'): Ninja[] {
    if (weapon) {
      return this.ninjas.filter((n) => n.weapon === weapon);
    }
    return this.ninjas;
  }

  getNinja(id: number): Ninja {
    const ninja = this.ninjas.find((n) => n.id === id);
    if (!ninja) {
      throw new Error('ninja not found');
    }
    return ninja;
  }

  createNinja(createNinjaDto: CreateNinjaDto): Ninja {
    createNinjaDto.id = Date.now();
    this.ninjas.push(createNinjaDto);
    return createNinjaDto;
  }

  updateNinja(id: number, updateNinjaDto: UpdateNinjaDto): Ninja {
    this.ninjas = this.ninjas.map((n) => {
      if (n.id === id) {
        n = { ...n, ...updateNinjaDto };
      }

      return n;
    });

    return this.getNinja(id);
  }

  removeNinja(id: number): Ninja {
    let toBeRemoved: Ninja;

    this.ninjas = this.ninjas.filter((n) => {
      if (n.id === id) toBeRemoved = n;

      return n.id !== id;
    });

    return toBeRemoved;
  }
}
