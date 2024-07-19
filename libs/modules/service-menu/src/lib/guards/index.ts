import { ServiceLineGuard } from './service-line.guard';
import { ServicePackageGuard } from './service-package.guard';
import { ServiceLineExistsGuard } from './service-line-exists.guard';
import { ServicePackageExistsGuard } from './service-package-exists.guard';

export const guards: any[] = [
  ServiceLineGuard,
  ServiceLineExistsGuard,
  ServicePackageExistsGuard,
  ServicePackageGuard,
];

export * from './service-line.guard';
export * from './service-package.guard';
export * from './service-line-exists.guard';
export * from './service-package-exists.guard';
