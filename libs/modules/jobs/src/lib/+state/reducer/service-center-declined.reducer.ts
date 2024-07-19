import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ServiceCenterDeclinedActions } from '../actions';

import { IReservations } from '../../models';

export interface ServiceCenterDeclinedState
  extends EntityState<IReservations.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
    mobileService: number;
    statusFilter: string[];
    dateFilter: string;
    serviceType:string;
  };
  selectedDeclined: IReservations.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<
  IReservations.IDocument
> = createEntityAdapter<IReservations.IDocument>({
  selectId: reseravtion => reseravtion.uuid
});

export const initialState: ServiceCenterDeclinedState = adapter.getInitialState(
  {
    total: 0,
    pagination: {
      limit: 10,
      page: 1,
      pages: 1,
      mobileService: null,
      statusFilter: null,
      dateFilter: null,
      serviceType:null
    },
    selectedDeclined: null,
    loaded: false,
    loading: false,
    error: null
  }
);

const serviceCenterDeclinedStateReducer = createReducer(
  initialState,

  on(
    ServiceCenterDeclinedActions.SetServiceCenterDeclinedPage,
    (state, { payload }) => {
      const { page, limit, statusFilter, mobileService ,serviceType} = payload;
      return {
        ...state,
        error: null,
        pagination: {
          ...state.pagination,
          statusFilter,
          mobileService,
          serviceType,
          page,
          limit
        }
      };
    }
  ),

  on(ServiceCenterDeclinedActions.LoadServicesCenterDeclined, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    ServiceCenterDeclinedActions.LoadServicesCenterDeclinedSuccess,
    (state, { reservations, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(reservations, {
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
    }
  ),

  on(
    ServiceCenterDeclinedActions.LoadServicesCenterDeclinedsFail,
    ServiceCenterDeclinedActions.GetServiceCenterDeclinedFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(ServiceCenterDeclinedActions.GetServiceCenterDeclinedSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedDeclined: payload,
      error: null,
    })
  ),

  on(ServiceCenterDeclinedActions.ResetSelectedServiceCenterDeclined, (state) => {
    return {
      ...state,
      selectedDeclined: null,
    };
  }),
);

export function reducer(
  state: ServiceCenterDeclinedState | undefined,
  action: ServiceCenterDeclinedActions.ServicesCenterDeclinedActionsUnion
) {
  return serviceCenterDeclinedStateReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Service Center Declined uuids
export const selectServiceCenterDeclinedUuids = selectIds;

// select the dictionary of Service Center Declined entities
export const selectServiceCenterDeclinedEntities = selectEntities;

// select the array of Service Center Declined
export const selectAllServiceCenterDeclined = selectAll;

// select the total Service Center Declined count
export const selectServiceCenterDeclinedTotal = selectTotal;
