import { SetMetadata } from '@nestjs/common';
import { Permission } from '../constants/enum.permission';

export const PERMISSION_KEY = 'permissions';
export const RequiredPermissions = (...permissions: Permission[]) => SetMetadata(PERMISSION_KEY, permissions);
