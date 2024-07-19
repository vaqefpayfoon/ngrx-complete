import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromModels from '../reducers/car-models.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IModels } from '../../models';

export const getModelsState = createSelector(
  fromFeature.getCarModelsState,
  (state: fromFeature.IModelsState) => state.carModels
);

export const getModelsEntities = createSelector(
  getModelsState,
  fromModels.selectModelsEntities
);

export const getModelsUuids = createSelector(
  getModelsState,
  fromModels.selectModelsUuids
);

export const getAllModels = createSelector(
  getModelsState,
  fromModels.selectAllModels
);

export const getModelsTotals = createSelector(
  getModelsState,
  fromModels.selectModelsTotal
);

export const getModelsTotal = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.total
);

export const getModelsConfig = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.pagination
);

export const getModelTempGalleryColorImage = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.tempImage
);

export const getUnit = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.unit
);

export const getModelsPage = createSelector(
  getModelsConfig,
  (pagination): IModels.IConfig => {
    return pagination
      ? { limit: pagination.limit, page: pagination.page }
      : { limit: 10, page: 1 };
  }
);

export const getSelectedModel = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.selectedModel
);

export const getModelsLoaded = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.loaded
);

export const getModelsModified = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.modified
);

export const getModelsLoading = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.loading
);

export const getModelsError = createSelector(
  getModelsState,
  (state: fromModels.ModelsState) => state.error
);

export const carModelsQuery = {
  getModelsUuids,
  getModelsEntities,
  getAllModels,
  getModelsTotal,
  getModelsTotals,
  getModelsConfig,
  getModelsPage,
  getSelectedModel,
  getModelsLoaded,
  getModelsLoading,
  getModelsError,
  getModelTempGalleryColorImage,
  getUnit,
  getModelsModified,
};
