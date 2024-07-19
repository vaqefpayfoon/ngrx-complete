import { AuthService } from './auth.service';
import { PermissionValidatorService } from './permission-validator.service';

export const services: any[] = [AuthService, PermissionValidatorService];

export * from './auth.service';
export * from './permission-validator.service';
