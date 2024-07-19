import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromLeadManagement from './lead.reducer';
import * as fromCorporates from './corporates.reducer';

export interface ILeadState {
  readonly leads: fromLeadManagement.ILeadManagementsState;
  readonly corporates: fromCorporates.CorporateState;
}

export const REDUCERS: ActionReducerMap<ILeadState> = {
  leads: fromLeadManagement.reducer,
  corporates: fromCorporates.reducer,
};

export const getLeadManagementsModuleState = createFeatureSelector<ILeadState>('leads');
