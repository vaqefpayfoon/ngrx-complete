import { ServiceLineResolver } from './service-line.resolver';
import { ServicePackageResolver } from './service-package.resolver';
import { ServiceLineExistsResolver } from './service-line-exists.resolver';
import { ServicePackageExistsResolver } from './service-package-exists.resolver';
import { GlobalBrandsResolver } from './global-brands.resolver';
import { ServiceTypesResolver } from './service-types.resolver';
import { CorporateResolver } from './corporate.resolver';
import { BranchResolver } from './branch.resolver';
import { PackageServiceLineResolver } from './package-service-line.resolver'
import { BranchInfoResolver } from './branch-info.resolver';
import { PackageBrandsResolver } from './package-brands.resolver';

export const resolvers: any[] = [
  ServiceLineExistsResolver,
  ServicePackageExistsResolver,
  ServiceLineResolver,
  ServicePackageResolver,
  GlobalBrandsResolver,
  ServiceTypesResolver,
  CorporateResolver,
  BranchResolver,
  PackageServiceLineResolver,
  BranchInfoResolver,
  PackageBrandsResolver
];

export * from './service-line.resolver';
export * from './service-package.resolver';
export * from './service-line-exists.resolver';
export * from './service-package-exists.resolver';
export * from './global-brands.resolver';
export * from './service-types.resolver';
export * from './corporate.resolver';
export * from './branch.resolver';
export * from './package-service-line.resolver';
export * from './branch-info.resolver';
export * from './package-brands.resolver';