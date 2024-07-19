import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { FleetsActions } from '../actions';

import { IFleet } from '../../models';

export interface FleetState extends EntityState<IFleet.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedFleet: IFleet.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IFleet.IDocument> = createEntityAdapter<
  IFleet.IDocument
>({
  selectId: fleet => fleet.uuid,
  sortComparer: sortByName
});

export const initialState: FleetState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedFleet: null,
  loaded: false,
  loading: false,
  error: null
});

export function sortByName(a: IFleet.IDocument, b: IFleet.IDocument): number {
  return a.name.localeCompare(b.name);
}

const fleetReducer = createReducer(
  initialState,

  on(FleetsActions.SetFleetsPage, (state, { payload }) => {
    const { page, limit } = payload.config;
    return {
      ...state,
      error: null,
      pagination: {
        ...state.pagination,
        page,
        limit
      }
    };
  }),

  on(FleetsActions.LoadFleets, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    FleetsActions.ActivateFleetSuccess,
    FleetsActions.DeactivateFleetSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(FleetsActions.LoadFleetsSuccess, (state, { fleets, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.addAll(fleets, {
      ...state,
      total,
      pagination: {
        ...state.pagination,
        page,
        pages,
        limit
      },
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(
    FleetsActions.LoadFleetsFail,
    FleetsActions.ActivateFleetFail,
    FleetsActions.DeactivateFleetFail,
    FleetsActions.GetFleetFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(FleetsActions.GetFleetSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedFleet: payload,
      error: null,
    })
  ),

  on(FleetsActions.CreateFleet, FleetsActions.UpdateFleet, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(FleetsActions.CreateFleetSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(FleetsActions.UpdateFleetSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(FleetsActions.ResetFleetStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(FleetsActions.ResetSelectedFleet, (state) => {
    return {
      ...state,
      selectedFleet: null,
    };
  }),
);

export function reducer(
  state: FleetState | undefined,
  action: FleetsActions.FleetsActionsUnion
) {
  return fleetReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Fleets uuids
export const selectFleetsUuids = selectIds;

// select the dictionary of Fleets entities
export const selectFleetsEntities = selectEntities;

// select the array of Fleets
export const selectAllFleets = selectAll;

// select the total Fleets count
export const selectFleetsTotal = selectTotal;
