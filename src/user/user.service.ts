import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  users(): any {
    return [
      { id: 1, name: 'Mehmet' },
      { id: 2, name: 'Mehmet' },
    ];
  }
}
