import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducer';
import * as fromServices from '../reducer/services.reducer';

import { IServices } from '../../models';

export const getServicesState = createSelector(
  fromFeature.getServiceState,
  (state: fromFeature.IServicesState) => state.service
);

export const getServicesUuids = createSelector(
  getServicesState,
  fromServices.selectServicesUuids
);

export const getServicesEntities = createSelector(
  getServicesState,
  fromServices.selectServicesEntities
);

export const getAllServices = createSelector(
  getServicesState,
  fromServices.selectAllServices
);

export const getFilteredServices = createSelector(
  getAllServices,
  (entities): IServices.IDocument[] => entities.filter(entity => entity.category === IServices.Category.PRODUCT)
);

export const getSelectedService = createSelector(
  getServicesState,
  (state: fromServices.ServicesState) => state.selectedService
);

export const getServicesTotals = createSelector(
  getServicesState,
  fromServices.selectServicesTotal
);

export const getSelectedCategory = createSelector(
  getServicesState,
  (state: fromServices.ServicesState) => state.category
);

export const getServicesLoaded = createSelector(
  getServicesState,
  (state: fromServices.ServicesState) => state.loaded
);

export const getServicesLoading = createSelector(
  getServicesState,
  (state: fromServices.ServicesState) => state.loading
);

export const getServicesError = createSelector(
  getServicesState,
  (state: fromServices.ServicesState) => state.error
);

export const ServicesQuery = {
  getServicesState,
  getServicesUuids,
  getServicesEntities,
  getAllServices,
  getFilteredServices,
  getSelectedService,
  getSelectedCategory,
  getServicesTotals,
  getServicesLoaded,
  getServicesLoading,
  getServicesError
};
