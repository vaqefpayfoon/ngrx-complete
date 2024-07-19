import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { IServiceLine } from '../../models';
import { ServiceLineAction } from '../actions';

export interface IServiceLineState extends EntityState<IServiceLine.IDocument> {
  total: number;
  filters?: IServiceLine.IFilter;
  sorts?: IServiceLine.ISort | undefined;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedServiceLine: IServiceLine.IDocument;
  loaded: boolean;
  loading: boolean;
  error?: any;
  brands: IServiceLine.IBrand[];
  services: IServiceLine.IServiceType;
  selectedCorporate: ICorporates.IDocument,
  selectedBranch: IBranches.IDocument
}

export const adapter: EntityAdapter<IServiceLine.IDocument> = createEntityAdapter<IServiceLine.IDocument>({
  selectId: (selectedServiceLine) => selectedServiceLine.uuid
});

const initialState: IServiceLineState = adapter.getInitialState({
  total: 0,
  filters: undefined,
  sorts: {
    updatedAt: -1,
  },
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  selectedServiceLine: null,
  loaded: false,
  loading: false,
  error: null,
  brands:[],
  services: null,
  selectedCorporate: null,
  selectedBranch: null
});

const ServiceLineReducer = createReducer(
  initialState,
  on(ServiceLineAction.loadServiceLines, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
      selectedServiceLine: null
    };
  }),
  on(ServiceLineAction.GetBranch, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
      selectedBranch: null
    };
  }),

  on(ServiceLineAction.loadServiceLinesSuccess, (state, { serviceLines, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(serviceLines, {
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
      selectedServiceLine: null
    });
  }),
  on(ServiceLineAction.loadServiceLinesFailed, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),
  on(ServiceLineAction.SetServiceLinePage, (state, { payload }) => {
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
  on(ServiceLineAction.ChangeServiceLinePage, (state, { payload }) => {
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
  on(ServiceLineAction.SetServiceLineFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: IServiceLine.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters,
    };
  }),
  on(ServiceLineAction.GetBranchSuccess, (state, { payload }) => {
    const selectedBranch = payload;
    return {
      ...state,
      selectedBranch,
    };
  }),
);

export function reducer(
  state: IServiceLineState | undefined,
  action: Action
) {
  return ServiceLineReducer(state, action);
}

const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal,
  } = adapter.getSelectors();
  
  // select the array of ServiceLine uuids
  export const selectServiceLinesUuids = selectIds;
  
  // select the dictionary of ServiceLine entities
  export const selectServiceLineManagementsEntities = selectEntities;
  
  // select the array of ServiceLine
  export const selectAllServiceLineManagements = selectAll;
  
  // select the total ServiceLine count
  export const selectServiceLineManagementsTotal = selectTotal;
