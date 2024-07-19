import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromBusinesses from './businesses.reducer';

export interface IBusinessesState {
  readonly business: fromBusinesses.BusinessState;
  readonly accounts: fromBusinesses.AccountState;
}

export const REDUCERS: ActionReducerMap<IBusinessesState> = {
  business: fromBusinesses.reducer,
  accounts: fromBusinesses.accountsReducer
};

export const getBusinessState = createFeatureSelector<IBusinessesState>(
  'business'
);
