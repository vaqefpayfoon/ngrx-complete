import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ReservationsActions } from '../actions';

import { IReservations } from '../../models';

export interface ReservationsState
  extends EntityState<IReservations.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
    mobileService: number;
    statusFilter: string[];
    dateFilter: string;
  };
  selectedReservation: IReservations.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<
  IReservations.IDocument
> = createEntityAdapter<IReservations.IDocument>({
  selectId: reseravtion => reseravtion.uuid || null
});

export const initialState: ReservationsState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
    mobileService: null,
    statusFilter: null,
    dateFilter: null
  },
  selectedReservation: null,
  loaded: false,
  loading: false,
  error: null
});

const reservationReducer = createReducer(
  initialState,

  on(ReservationsActions.LoadReservations, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(ReservationsActions.SetReservationPage, (state, { payload }) => {
    const { page, limit, statusFilter, mobileService } = payload;
    return {
      ...state,
      error: null,
      pagination: {
        ...state.pagination,
        statusFilter,
        mobileService,
        page,
        limit
      }
    };
  }),

  on(
    ReservationsActions.LoadReservationsSuccess,
    (state, { reservations, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(reservations, {
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

  on(ReservationsActions.GetReservationSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedReservation: payload,
      error: null,
    })
  ),

  on(ReservationsActions.LoadReservationsFail, ReservationsActions.GetReservationFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loaded: false, loading: false, error };
  }),

  on(ReservationsActions.ResetSelectedReservation, (state) => {
    return {
      ...state,
      selectedReservation: null,
    };
  })
);

export function reducer(
  state: ReservationsState | undefined,
  action: ReservationsActions.ReservationsActionsUnion
) {
  return reservationReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Reservations uuids
export const selectReservationsUuids = selectIds;

// select the dictionary of Reservations entities
export const selectReservationsEntities = selectEntities;

// select the array of Reservations
export const selectAllReservations = selectAll;

// select the total Reservations count
export const selectReservationsTotal = selectTotal;
