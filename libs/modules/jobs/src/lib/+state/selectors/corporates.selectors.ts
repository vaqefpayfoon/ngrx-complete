import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromCorporates from '../reducer/corporates.reducer';

export const getCorporatesState = createSelector(
  fromFeature.getReservationsState,
  (state: fromFeature.IReservationsState) => state.corporates
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
