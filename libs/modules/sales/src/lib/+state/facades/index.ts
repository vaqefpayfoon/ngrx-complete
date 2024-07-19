import { PurchasesFacade } from './purchases.facade';
import { PurchaseQuotesFacade } from './purchase-quotes.facade';
import { ValuationsFacade } from './valuations.facade';
import { TradeInFacade } from './trade-in.facade';
import { BankLoansBySaleFacade } from './bank-loans-by-sale.facade';

export const facades: any[] = [
  PurchasesFacade,
  PurchaseQuotesFacade,
  ValuationsFacade,
  TradeInFacade,
  BankLoansBySaleFacade,
];

export * from './purchases.facade';
export * from './purchase-quotes.facade';
export * from './valuations.facade';
export * from './trade-in.facade';
export * from './bank-loans-by-sale.facade';
