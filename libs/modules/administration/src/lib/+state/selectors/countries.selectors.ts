import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCountries from '../reducers/countries.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { ICountry } from '../../models';

export const getCountriesState = createSelector(
  fromFeature.getAdminState,
  (state: fromFeature.IAdminState) => state.countries
);

export const selectCountriesUuids = createSelector(
  getCountriesState,
  fromCountries.selectCountriesUuids
);

export const getCountriesEntities = createSelector(
  getCountriesState,
  fromCountries.selectCountriesEntities
);

export const getAllCountries = createSelector(
  getCountriesState,
  fromCountries.selectAllCountries
);

export const getCountriesTotal = createSelector(
  getCountriesState,
  fromCountries.selectCountriesTotal
);

export const getSelectedCountry = createSelector(
  getCountriesEntities,
  fromRoot.getRouterState,
  (entities, router): ICountry.IDocument => {
    return entities ? router.state && entities[router.state.params.uuid] : null;
  }
);

export const getAllCountryNames = createSelector(
  getCountriesState,
  (state: fromCountries.CountryState) => state.countries
);

export const getCountries = createSelector(
  getCountriesEntities,
  entities =>
    entities ? Object.keys(entities).map(uuid => entities[uuid]) : null
);

export const getCountrySelected = createSelector(
  getCountriesState,
  (state: fromCountries.CountryState) => state.selectedCountry
);

export const getCountriesLoaded = createSelector(
  getCountriesState,
  (state: fromCountries.CountryState) => state.loaded
);

export const getCountriesLoading = createSelector(
  getCountriesState,
  (state: fromCountries.CountryState) => state.loading
);

export const getCountriesError = createSelector(
  getCountriesState,
  (state: fromCountries.CountryState) => state.error
);

export const countryQuery = {
  selectCountriesUuids,
  getCountriesEntities,
  getAllCountries,
  getCountriesTotal,
  getSelectedCountry,
  getAllCountryNames,
  getCountries,
  getCountrySelected,
  getCountriesLoaded,
  getCountriesLoading,
  getCountriesError
};
