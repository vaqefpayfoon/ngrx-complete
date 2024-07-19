import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCorporates from './corporates.reducer';
import * as fromBranches from './branch.reducer';
import * as fromApps from './apps.reducer';
import * as fromAgreements from './agreements.reducer';
import * as fromBrands from './brands.reducers';
import * as fromOperationAccounts from './operation-accounts.reducer';
import * as fromOffDays from './off-days.reducer';

export interface ICorporateState {
  readonly corporates: fromCorporates.CorporateState;
  readonly branches: fromBranches.BrancheState;
  readonly apps: fromApps.AppsState;
  readonly agreements: fromAgreements.AgreementsState;
  readonly brands: fromBrands.BrandsState;
  readonly operationAccounts: fromOperationAccounts.OperationAccountState;
  readonly offDays: fromOffDays.IOffDaysState;
}

export const REDUCERS: ActionReducerMap<ICorporateState> = {
  corporates: fromCorporates.reducer,
  branches: fromBranches.reducer,
  apps: fromApps.reducer,
  agreements: fromAgreements.reducer,
  brands: fromBrands.reducer,
  operationAccounts: fromOperationAccounts.reducer,
  offDays: fromOffDays.reducer
};

export const getCorporateState = createFeatureSelector<ICorporateState>(
  'corporates'
);
