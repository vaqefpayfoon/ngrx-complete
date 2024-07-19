import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { INextService } from '../../models';
import { NextServiceAction } from '../actions';

export interface INextServiceState extends EntityState<INextService.ITotal> {
  total: number;
  filters?: INextService.IFilter;
  sorts: INextService.ISort;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<INextService.ITotal> = createEntityAdapter<INextService.ITotal>({
  selectId: (selectedService) => selectedService.uuid
});

const initialState: INextServiceState = adapter.getInitialState({
  uuid: '1',
  total: 0,
  sorts: {
    updatedAt: -1,
  },
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  error: null,
  filters: {type: 'UPCOMING_UNSCHEDULED'}
});

const nextServiceReducer = createReducer(
  initialState,
  on(NextServiceAction.loadNextServices, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(NextServiceAction.loadNextServicesSuccess, (state, { data, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setOne(data, {
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
  }),
  on(NextServiceAction.loadNextServicesFailed, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),
  on(NextServiceAction.SetNextServicesPage, (state, { payload }) => {
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
  on(NextServiceAction.ChangeNextServicesPage, (state, { payload }) => {
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
  on(NextServiceAction.SetNextServicesFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: INextService.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters,
    };
  }),
);

export function reducer(
  state: INextServiceState | undefined,
  action: Action
) {
  return nextServiceReducer(state, action);
}

const {
    selectAll,
    selectEntities,
    selectTotal,
    
  } = adapter.getSelectors();
  

  
  // select the dictionary of NextService entities
  export const selectNextServiceEntities = selectEntities;
  
  // select the array of NextService
  export const selectAllNextService = selectAll;
  
  // select the total NextService count
  export const selectNextServiceTotal = selectTotal;
