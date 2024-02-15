import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/role/role.enum';

export const HasRoles = (...role: Role[]) => SetMetadata('role', role);