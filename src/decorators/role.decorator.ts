import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../schema/user.schema';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
