import { SalesService } from './sales.service';
import { TradeInService } from './trade-in.service';
import { BankLoansService } from './bank-loans.service';
import { PurchaseQuoteService } from './purchase-quote.service';

export const services: any[] = [
  SalesService,
  TradeInService,
  PurchaseQuoteService,
  BankLoansService,
];

export * from './sales.service';
export * from './trade-in.service';
export * from './bank-loans.service';
export * from './purchase-quote.service';
