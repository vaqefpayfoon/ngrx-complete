import { LeadExistsResolver } from './lead-exists.resolver';
import { LeadManagementResolver } from './lead.resolver';
import { WishListExistsResolver } from './wish-list-exists.resolver';
import { PurchaseQuoteResolver } from './purchase-quote-exists.resolver';
import { GlobalBrandsResolver } from './global-brands.resolver';
import { TestDriveExistsResolver } from './lead-test-drive.resolver';

export const resolvers: any[] = [
  LeadManagementResolver,
  LeadExistsResolver,
  WishListExistsResolver,
  PurchaseQuoteResolver,
  GlobalBrandsResolver,
  TestDriveExistsResolver
];

export * from './lead.resolver';
export * from './lead-exists.resolver';
export * from './wish-list-exists.resolver';
export * from './purchase-quote-exists.resolver';
export * from './global-brands.resolver';
export * from './lead-test-drive.resolver';