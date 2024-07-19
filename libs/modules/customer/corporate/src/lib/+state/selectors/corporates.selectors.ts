import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCorporates from '../reducers/corporates.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ICorporates } from '../../models';

export const getCorporatesState = createSelector(
  fromFeature.getCorporateState,
  (state: fromFeature.ICorporateState) => state.corporates
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

export const getCorporatesConfig = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.pagination
);

export const getCorporatesPage = createSelector(
  getCorporatesConfig,
  (pagination): ICorporates.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getCorporatesTotals = createSelector(
  getCorporatesState,
  fromCorporates.selectCorporatesTotal
);

export const getCorporatesTotal = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.total
);

export const getCorporateUploadedSocialImage = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.socialImage
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

export const getCorporatesAppImages = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.appImage
);

export const getOperations = createSelector(
  getCorporatesState,
  (state: fromCorporates.CorporateState) => state.operations
);

export const corporatesQuery = {
  getCorporatesState,
  getCorporatesUuids,
  getCorporatesEntities,
  getAllCorporates,
  getSelectedCorporate,
  getCorporatesConfig,
  getCorporatesPage,
  getCorporatesTotals,
  getCorporatesTotal,
  getCorporatesLoaded,
  getCorporatesLoading,
  getCorporatesError,
  getCorporateUploadedSocialImage,
  getCorporatesAppImages,
  getOperations,
};
