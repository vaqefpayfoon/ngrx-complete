import { ServicesGuard } from './services.guard';
import { ServiceExistsGuard } from './service-exists.guard';

export const guards: any[] = [ServicesGuard, ServiceExistsGuard];

export * from './services.guard';
export * from './service-exists.guard';
