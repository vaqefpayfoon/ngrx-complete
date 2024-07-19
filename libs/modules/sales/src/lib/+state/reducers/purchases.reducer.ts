//Ngrx
import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

//Actions
import { PurchasesActions } from '../actions';

//Models
import { IPurchases, ISales } from '../../models';

import { ISalesAdvisor } from '@neural/modules/administration';
import { IModels } from '@neural/modules/models';
import { IVehicle } from '@neural/modules/customer/vehicles';

export interface PurchasesState extends EntityState<IPurchases.IDocument> {
  total: number;
  filters: ISales.IFilter;
  sorts: ISales.ISort;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedPurchase: IPurchases.IDocument;
  salesAdvisor: ISalesAdvisor.ISADocument[];
  unit: IModels.IUnitList;
  globalVehicles: IVehicle.IGlobalVehicle | null;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IPurchases.IDocument> = createEntityAdapter<
  IPurchases.IDocument
>({
  selectId: (sale) => sale.uuid,
});

export const initialState: PurchasesState = adapter.getInitialState({
  total: 0,
  saleAdvisors: null,
  sorts: {
    updatedAt: -1,
  },
  filters: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  selectedPurchase: null,
  salesAdvisor: null,
  unit: null,
  globalVehicles: null,
  loaded: false,
  loading: false,
  error: null,
});

const purchaseReducer = createReducer(
  initialState,

  on(PurchasesActions.SetPurchasesPage, (state, { payload }) => {
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

  on(PurchasesActions.ChangePurchasesPage, (state, { payload }) => {
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

  on(PurchasesActions.SetPurchasesFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: ISales.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters,
    };
  }),

  on(PurchasesActions.LoadPurchases, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    PurchasesActions.GetPurchaseFail,
    PurchasesActions.UpdatePurchaseFail,
    PurchasesActions.UpdatePurchaseFulfillmentFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(PurchasesActions.LoadPurchasesFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),

  on(PurchasesActions.LoadPurchasesSuccess, (state, { sales, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(sales, {
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

  on(
    PurchasesActions.CancelPurchaseSuccess,
    PurchasesActions.CompletePurchaseSuccess,
    PurchasesActions.UpdatePurchaseSuccess,
    PurchasesActions.ClearSaleBadgeSuccess,
    PurchasesActions.ClearAllSaleBadgesSuccess,
    PurchasesActions.UpdatePurchaseFulfillmentSuccess,
    (state, { payload }) => {
      const fulfillments = payload.changes;
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
        selectedPurchase: {
          ...state.selectedPurchase,
          ...fulfillments,
        },
      });
    }
  ),

  on(PurchasesActions.GetPurchaseSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedPurchase: payload,
      error: null,
    })
  ),

  on(PurchasesActions.ResetSelectedPurchases, (state) => {
    return {
      ...state,
      selectedPurchase: null,
    };
  }),

  on(PurchasesActions.GetSalesAdvisorSuccess, (state, { payload }) => {
    const salesAdvisor = payload;
    return {
      ...state,
      salesAdvisor,
    };
  }),

  on(PurchasesActions.GetBrandsAndSeries, (state) => {
    return {
      ...state,
      unit: null,
    };
  }),

  on(PurchasesActions.GetBrandsAndSeriesSuccess, (state, { payload }) => {
    const brandsAndSeries = payload;
    return {
      ...state,
      unit: {
        ...state.unit,
        brandsAndSeries,
      },
      modified: true,
    };
  }),

  on(PurchasesActions.GetSeriesModels, (state) => {
    return {
      ...state,
      unit: {
        ...state.unit,
        models: null,
        variants: null,
      },
    };
  }),

  on(PurchasesActions.GetSeriesModelsSuccess, (state, { payload }) => {
    const { models } = payload;
    return {
      ...state,
      loading: false,
      unit: {
        ...state.unit,
        models,
      },
    };
  }),

  on(PurchasesActions.GetVariantsSuccess, (state, { payload }) => {
    const variants = payload;
    return {
      ...state,
      loading: false,
      unit: {
        ...state.unit,
        variants,
      },
    };
  }),

  on(PurchasesActions.GetVariants, (state) => {
    return {
      ...state,
      loading: false,
      unit: {
        ...state.unit,
        variants: null,
      },
    };
  }),

  on(PurchasesActions.GetVariantsSuccess, (state, { payload }) => {
    const variants = payload;
    return {
      ...state,
      loading: false,
      unit: {
        ...state.unit,
        variants,
      },
    };
  }),

  on(PurchasesActions.ResetUnit, (state) => {
    return {
      ...state,
      unit: {
        ...state.unit,
        models: null,
        variants: null,
      },
    };
  }),

  on(PurchasesActions.GetGlobalBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      globalVehicles: {
        brands,
        models: null,
        variants: null,
      },
    };
  }),

  on(PurchasesActions.GetGlobalModelsSuccess, (state, { payload }) => {
    const models = payload;
    return {
      ...state,
      globalVehicles: {
        ...state.globalVehicles,
        models,
        variants: null,
      },
    };
  }),

  on(PurchasesActions.GetGlobalVariantsSuccess, (state, { payload }) => {
    const variants = payload;
    return {
      ...state,
      globalVehicles: {
        ...state.globalVehicles,
        variants,
      },
    };
  })
);

export function reducer(
  state: PurchasesState | undefined,
  action: PurchasesActions.PurchasesActionsUnion
) {
  return purchaseReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Sales uuids
export const selectPurchasesUuids = selectIds;

// select the dictionary of Sales entities
export const selectPurchasesEntities = selectEntities;

// select the array of Sales
export const selectAllPurchases = selectAll;

// select the total Sales count
export const selectPurchasesTotal = selectTotal;
