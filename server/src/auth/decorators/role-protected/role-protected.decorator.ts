import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[] | string[]) =>
  SetMetadata(META_ROLES, args);
