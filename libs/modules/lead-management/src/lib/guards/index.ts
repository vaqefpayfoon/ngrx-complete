import { LeadExistsGuard } from './lead-exists.guard';
import { LeadManagementGuard } from './lead.guard';
import { WishListExistsGuard } from './wish-list-exists.guard';
import { PurchaseQuoteExistsGuard } from './purchase-quote-exists.guard';
import { LeadManagementCreateGuard } from './lead-create.guard'

export const guards: any[] = [
  LeadManagementGuard,
  LeadExistsGuard,
  WishListExistsGuard,
  PurchaseQuoteExistsGuard,
  LeadManagementCreateGuard
];

export * from './lead.guard';
export * from './lead-exists.guard';
export * from './wish-list-exists.guard';
export * from './purchase-quote-exists.guard';
export * from './lead-create.guard'
