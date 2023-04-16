import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { PERMISSION_KEY } from './permission.decorator';

import { Permission } from '../constants/enum.permission';
import { IDecodedJWT } from '../constants/constant.auth';
import { Role } from '../constants/enum.role';

@Injectable()
export class PermissionGuard implements CanActivate {
    private readonly NO_PERMISSION = "You don't have permission to access this resource";

    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
        PERMISSION_KEY,
        [context.getHandler(), context.getClass()],
        );
        const { user, params, body } = context.switchToHttp().getRequest();
        return this.validateRequest(user, requiredPermissions, params, body);
    }

    validateRequest(
        user: IDecodedJWT,
        permissions: Array<Permission>,
        params: any,
        body: any,
    ): boolean {
        if (!permissions) {
            return true;
        }

        if (
            permissions &&
            permissions.includes(Permission.ADMIN) &&
            user &&
            user.role === Role.Admin
        ) {
            return true;
        }

        if (
            permissions &&
            permissions.includes(Permission.SELF) &&
            user &&
            user._id.toString() === params.id
        ) {
            return true;
        }

        // if (
        //   permissions &&
        //   permissions.includes(Permission.SELF) &&
        //   user &&
        //   user._id.toString() === params.id
        // ) {
        //   return true;
        // }

        throw new HttpException(this.NO_PERMISSION, HttpStatus.FORBIDDEN);
    }
}

