import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CountriesActions } from '../actions';

import { ICountry } from '../../models';

export interface CountryState extends EntityState<ICountry.IDocument> {
  countries: string[];
  selectedCountry: ICountry.IGetCountry;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<ICountry.IDocument> = createEntityAdapter<
  ICountry.IDocument
>({
  selectId: country => country.uuid,
  sortComparer: sortByName
});

export const initialState: CountryState = adapter.getInitialState({
  countries: null,
  selectedCountry: null,
  loaded: false,
  loading: false,
  error: null
});

export function sortByName(
  a: ICountry.IDocument,
  b: ICountry.IDocument
): number {
  return a.name.localeCompare(b.name);
}

const countryReducer = createReducer(
  initialState,

  on(
    CountriesActions.LoadCountries,
    CountriesActions.LoadCountryNames,
    state => {
      return adapter.removeAll({
        ...state,
        loading: true,
        loaded: false,
        error: null
      });
    }
  ),

  on(CountriesActions.CreateCountry, CountriesActions.UpdateCountry, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CountriesActions.GetCountry, state => ({
    ...state,
    loading: true,
    selectedCountry: null,
    error: null
  })),

  on(
    CountriesActions.LoadCountriesFail,
    CountriesActions.LoadCountryNamesFail,
    CountriesActions.GetCountryFail,
    CountriesActions.CreateCountryFail,
    CountriesActions.UpdateCountryFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(CountriesActions.LoadCountriesSuccess, (state, { payload }) =>
    adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(CountriesActions.CreateCountrySuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(CountriesActions.UpdateCountrySuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(
    CountriesActions.ActivateCountrySuccess,
    CountriesActions.DeactivateCountrySuccess,
    CountriesActions.ResetCountryStatus,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(CountriesActions.LoadCountryNamesSuccess, (state, { payload }) => {
    const countries = payload;

    return {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      countries
    };
  }),

  on(CountriesActions.GetCountrySuccess, (state, { payload }) => {
    const selectedCountry: ICountry.IGetCountry = {
      codes: payload.codes,
      states: payload.states
    };

    return {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      selectedCountry
    };
  }),

  on(CountriesActions.ResetCountryForm, (state, { payload }) => {
    const selectedCountry: ICountry.IGetCountry = {
      codes: payload.codes,
      states: payload.states
    };

    return {
      ...state,
      error: null,
      selectedCountry
    };
  })
);

export function reducer(
  state: CountryState | undefined,
  action: CountriesActions.CountiesActionsUnion
) {
  return countryReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Countries uuids
export const selectCountriesUuids = selectIds;

// select the dictionary of Countries entities
export const selectCountriesEntities = selectEntities;

// select the array of Countries
export const selectAllCountries = selectAll;

// select the total Countries count
export const selectCountriesTotal = selectTotal;
