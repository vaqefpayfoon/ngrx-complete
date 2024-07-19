import { PurchasesGuard } from './purchases.guard';
import { PurchaseExistsGuard } from './purchase-exists.guard';
import { BankLoansBySaleGuard } from './bank-loans-by-sale.guard';
import { PurchaseQuotesGuard } from './purchase-quotes.guard';
import { PurchaseQuoteExistsGuard } from './purchase-quote-exists.guard';

export const guards: any[] = [
  PurchasesGuard,
  PurchaseExistsGuard,
  BankLoansBySaleGuard,
  PurchaseQuotesGuard,
  PurchaseQuoteExistsGuard,
];

export * from './purchases.guard';
export * from './purchase-exists.guard';
export * from './bank-loans-by-sale.guard';
export * from './purchase-quotes.guard';
export * from './purchase-quote-exists.guard';
