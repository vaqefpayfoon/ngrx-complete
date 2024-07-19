import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCorporates from '../reducers/corporates.reducer';

export const getCorporatesState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.corporates
);

export const getCorporatesUuids = createSelector(
  getCorporatesState,
  fromCorporates.selectCorporatesUuids
);

export const getCorporatesEntities = createSelector(
  getCorporatesState,
  fromCorporates.selectCorporatesEntities
);

export const getAllCorporates = createSelector(
  getCorporatesState,
  fromCorporates.selectAllCorporates
);

export const getSelectedCorporate = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.selectedCorporate
);

export const corporatesQuery = {
  getCorporatesState,
  getCorporatesUuids,
  getCorporatesEntities,
  getAllCorporates,
  getSelectedCorporate,
};
