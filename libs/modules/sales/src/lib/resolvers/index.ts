import { PurchasesResolver } from './purchases.resolver';
import { PurchaseExistsResolver } from './purchase-exists.resolver';
import { BankLoansBySaleResolver } from './bank-loans-by-sale.resolver';
import { PurchaseQuotesResolver } from './purchase-quotes.resolver';
import { PurchaseQuoteExistsResolver } from './purchase-quote-exists.resolver';
import { BankLoansByQuotesResolver } from './bank-loans-by-quotes.resolver';

export const resolvers: any[] = [
  PurchasesResolver,
  PurchaseExistsResolver,
  BankLoansBySaleResolver,
  PurchaseQuotesResolver,
  PurchaseQuoteExistsResolver,
  BankLoansByQuotesResolver,
];

export * from './purchases.resolver';
export * from './purchase-exists.resolver';
export * from './bank-loans-by-sale.resolver';
export * from './purchase-quotes.resolver';
export * from './purchase-quote-exists.resolver';
export * from './bank-loans-by-quotes.resolver';
