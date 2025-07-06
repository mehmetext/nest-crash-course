import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Endpoint'te tanımlanan roller
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Eğer rol kontrolü yoksa erişime izin ver
    if (!requiredRoles) {
      return true;
    }

    // Request'ten user bilgisini al
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    // User yoksa erişimi reddet
    if (!user) {
      return false;
    }

    // User'ın rolü gerekli rollerden biriyse erişime izin ver
    return requiredRoles.some((role) => user.role === role);
  }
}
