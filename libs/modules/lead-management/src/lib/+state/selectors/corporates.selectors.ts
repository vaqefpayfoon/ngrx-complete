import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCorporates from '../reducers/corporates.reducer';

import { ICorporates } from '../../models';

export const getCorporatesState = createSelector(
  fromFeature.getLeadManagementsModuleState,
  (state: fromFeature.ILeadState) => state.corporates
);

export const getCorporatesUuids = createSelector(
  getCorporatesState,
  fromCorporates.selectCorporatesUuids
);

export const getSelectedCorporate = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.selectedCorporate
);


export const getCorporatesLoaded = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.loaded
);

export const getCorporatesLoading = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.loading
);

export const getCorporatesError = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.error
);


export const corporatesQuery = {
  getCorporatesState,
  getCorporatesUuids,
  getSelectedCorporate,
  getCorporatesLoaded,
  getCorporatesLoading,
  getCorporatesError,
};
