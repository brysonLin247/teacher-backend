import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseService } from 'src/modules/base/base.service';
import { ROLES_KEY } from 'src/modules/roles/roles.decorator';
import { Role } from 'src/modules/roles/roles.interface';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private baseService: BaseService) { }

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const adminUser = await this.baseService.checkAdmin(user?.id);
    return !!adminUser;
  }
}