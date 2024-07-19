import { PurchaseQuotesEffects } from './purchase-quotes.effects';
import { ValuationsEffects } from './valuations.effects';
import { PurchasesEffects } from './purchases.effects';
import { TradeInEffects } from './trade-in.effects';
import { BankLoansEffects } from './bank-loans.effects';

export const EFFECTS: any[] = [
  PurchaseQuotesEffects,
  ValuationsEffects,
  PurchasesEffects,
  TradeInEffects,
  BankLoansEffects,
];

export * from './purchase-quotes.effects';
export * from './valuations.effects';
export * from './purchases.effects';
export * from './trade-in.effects';
export * from './bank-loans.effects';
