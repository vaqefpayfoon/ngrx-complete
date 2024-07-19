import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ReservationsActions } from '../actions';

import { ICorporates } from '@neural/modules/customer/corporate';

export interface CorporateState extends EntityState<ICorporates.IDocument> {
  selectedCorporate: ICorporates.IDocument | null;
  socialImage: {
    url: string;
    index: number;
  };
  appImage: {
    [file: string]: string;
  };
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<ICorporates.IDocument> = createEntityAdapter<
  ICorporates.IDocument
>({
  selectId: (corporate) => corporate.uuid,
  sortComparer: sortByName,
});

export const initialState: CorporateState = adapter.getInitialState({
  selectedCorporate: null,
  socialImage: null,
  total: 0,
  appImage: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  error: null,
});

export function sortByName(
  a: ICorporates.IDocument,
  b: ICorporates.IDocument
): number {
  return a.name.localeCompare(b.name);
}

const corporateReducer = createReducer(
  initialState,

  on(ReservationsActions.LoadCorporate, (state) => ({
    ...state,
    socialImage: null,
    appImage: null,
    loaded: false,
    error: null,
  })),

  on(ReservationsActions.LoadCorporateSuccess, (state, { payload }) =>
  adapter.upsertOne(payload, {
    ...state,
    selectedCorporate: payload,
    error: null,
  })
),

  on(
    ReservationsActions.LoadCorporateFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),
)

export function reducer(
  state: CorporateState | undefined,
  action: ReservationsActions.ReservationsActionsUnion
) {
  return corporateReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Corporates uuids
export const selectCorporatesUuids = selectIds;

// select the dictionary of Corporates entities
export const selectCorporatesEntities = selectEntities;

// select the array of Corporates
export const selectAllCorporates = selectAll;

// select the total Corporates count
export const selectCorporatesTotal = selectTotal;
