import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { OffDaysActions } from '../actions';

import { IBranches } from '../../models';

export interface IOffDaysState extends EntityState<IBranches.IOffDaysList> {
  loaded: boolean;
  loading: boolean;
  total: number;
  error: string | null;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
}

export const adapter: EntityAdapter<IBranches.IOffDaysList> = createEntityAdapter<
  IBranches.IOffDaysList
>({
  selectId: (offDays) => offDays.uuid,
});

export const initialState: IOffDaysState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  total: 0
});

const roleReducer = createReducer(
  initialState,

  on(OffDaysActions.SetOffDaysListPage, (state, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...initialState,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    });
  }),
  on(OffDaysActions.ChangeOffDaysListPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...state,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),
  on(OffDaysActions.loadOffDaysList, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(
    OffDaysActions.loadOffDaysListSuccess,
    (state, { payload, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(payload, {
        ...state,
        total,
        pagination: {
          ...state.pagination,
          page,
          pages,
          limit,
        },
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),
);

export function reducer(
  state: IOffDaysState | undefined,
  action: OffDaysActions.OffDaysActionsUnion
) {
  return roleReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of OffDays uuids
export const selectOffDaysUuids = selectIds;

// select the dictionary of OffDays entities
export const selectOffDaysEntities = selectEntities;

// select the array of OffDays
export const selectAllOffDays = selectAll;

// select the total OffDays count
export const selectOffDaysTotal = selectTotal;
