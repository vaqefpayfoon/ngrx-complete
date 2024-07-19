import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromPurchases from './purchases.reducer';
import * as fromPurchasQuotes from './purchase-quotes.reducer';
import * as fromValuations from './valuations.reducer';
import * as fromTradeIn from './trade-in.reducer';
import * as fromBankLoans from './bank-loans.reducer';

export interface ISalesState {
  readonly purchases: fromPurchases.PurchasesState;
  readonly purchaseQuotes: fromPurchasQuotes.PurchaseQuotesState;
  readonly valuations: fromValuations.ValuationsState;
  readonly tradeIn: fromTradeIn.TradeInState;
  readonly bankLoans: fromBankLoans.BankLoansState;
}

export const REDUCERS: ActionReducerMap<ISalesState> = {
  purchases: fromPurchases.reducer,
  purchaseQuotes: fromPurchasQuotes.reducer,
  valuations: fromValuations.reducer,
  tradeIn: fromTradeIn.reducer,
  bankLoans: fromBankLoans.reducer,
};

export const getSalesModuleState = createFeatureSelector<ISalesState>('sales');
