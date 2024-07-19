import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { IServiceLine, IServicePackage } from '../../models';
import { ServicePackageAction } from '../actions';

export interface IServicePackageState extends EntityState<IServicePackage.IDocument> {
  total: number;
  filters?: IServiceLine.IFilter;
  sorts?: IServiceLine.ISort | undefined;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedServicePackage: IServicePackage.IDocument;
  loaded: boolean;
  loading: boolean;
  error?: any;
  brands: IServiceLine.IBrand[];
  selectedCorporate: ICorporates.IDocument,
  selectedBranch: IBranches.IDocument,
  serviceLines: IServiceLine.IDocument[]
}

export const adapter: EntityAdapter<IServicePackage.IDocument> = createEntityAdapter<IServicePackage.IDocument>({
  selectId: (selectedServicePackage) => selectedServicePackage.uuid
});

const initialState: IServicePackageState = adapter.getInitialState({
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
  selectedServicePackage: null,
  loaded: false,
  loading: false,
  error: null,
  brands:[],
  serviceLines: [],
  selectedCorporate: null,
  selectedBranch: null,
});

const ServicePackageReducer = createReducer(
  initialState,
  on(ServicePackageAction.loadServicePackages, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
      selectedServicePackage: null
    };
  }),
  on(ServicePackageAction.GetBranch, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(ServicePackageAction.ResetStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ServicePackageAction.loadServicePackagesSuccess, (state, { servicePackages, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(servicePackages, {
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
      selectedServicePackage: null
    });
  }),
  on(ServicePackageAction.loadServiceLinesSuccess, (state, { payload }) => {
    const serviceLines = payload;
    return {
      ...state,
      serviceLines,
    };
  }),
  on(ServicePackageAction.loadServicePackagesFailed, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),
  on(ServicePackageAction.SetServicePackagePage, (state, { payload }) => {
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
  on(ServicePackageAction.ChangeServicePackagePage, (state, { payload }) => {
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
  on(ServicePackageAction.CreateServicePackageSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: false,
      error: null,
    });
  }),
  on(ServicePackageAction.UpdateServicePackageSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      selectedServicePackage: {
        ...state.selectedServicePackage,
        ...payload.changes
      }
    });
  }),
  on(
    ServicePackageAction.CreateServicePackage,
    ServicePackageAction.UpdateServicePackage,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),
  on(ServicePackageAction.SetServicePackageFilters, (state, { payload }) => {
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
  on(
    ServicePackageAction.GetServicePackageFail,
    ServicePackageAction.UpdateServicePackageFail,
    ServicePackageAction.CreateServicePackageFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),
  on(ServicePackageAction.GetServicePackageSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedServicePackage: payload,
      error: null,
    })
  ),
  on(ServicePackageAction.GetBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      brands,
    };
  }),
  on(ServicePackageAction.LoadCorporateSuccess, (state, { payload }) => {
    const selectedCorporate = payload;
    return {
      ...state,
      selectedCorporate,
    };
  }),
  on(ServicePackageAction.GetBranchSuccess, (state, { payload }) => {
    const selectedBranch = payload;
    return {
      ...state,
      selectedBranch,
    };
  }),
  on(ServicePackageAction.ChangeStatusServicePackageSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
      selectedServicePackage: {
        ...state.selectedServicePackage,
        ...payload.changes
      }
    });
  }),
);

export function reducer(
  state: IServicePackageState | undefined,
  action: Action
) {
  return ServicePackageReducer(state, action);
}

const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal,
  } = adapter.getSelectors();
  
  // select the array of ServicePackage uuids
  export const selectServicePackagesUuids = selectIds;
  
  // select the dictionary of ServicePackage entities
  export const selectServicePackageManagementsEntities = selectEntities;
  
  // select the array of ServicePackage
  export const selectAllServicePackageManagements = selectAll;
  
  // select the total ServicePackage count
  export const selectServicePackageManagementsTotal = selectTotal;
