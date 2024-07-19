//Ngrx
import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

//Actions
import { PurchaseQuotesActions } from '../actions';

//Models
import { IPurchases, ISales } from '../../models';

import { IModels } from '@neural/modules/models';
import { IVehicle } from '@neural/modules/customer/vehicles';
import { ISalesAdvisor } from '@neural/modules/administration';

export interface PurchaseQuotesState extends EntityState<IPurchases.IDocument> {
  total: number;
  filters: ISales.IFilter;
  sorts: ISales.ISort;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  unit: IModels.IUnitList;
  selectedPurchase: IPurchases.IDocument;
  salesAdvisor: ISalesAdvisor.ISADocument[];
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

export const initialState: PurchaseQuotesState = adapter.getInitialState({
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
  unit: null,
  globalVehicles: null,
  salesAdvisor: null,
  loaded: false,
  loading: false,
  error: null,
});

const purchaseQuotesReducer = createReducer(
  initialState,

  on(PurchaseQuotesActions.SetPurchaseQuotesPage, (state, { payload }) => {
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

  on(PurchaseQuotesActions.ChangePurchaseQuotesPage, (state, { payload }) => {
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

  on(PurchaseQuotesActions.SetPurchaseQuotesFilters, (state, { payload }) => {
    const filters = payload;
    return {
      ...state,
      pagination: {
        limit: ISales.Config.LIMIT,
        page: 1,
        pages: 1,
      },
      filters: {
        ...state.filters,
        ...filters,
      },
    };
  }),

  on(PurchaseQuotesActions.LoadPurchaseQuotes, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    PurchaseQuotesActions.GetPurchaseQuoteFail,
    PurchaseQuotesActions.UpdatePurchaseQuoteFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(PurchaseQuotesActions.LoadPurchaseQuotesFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      filters: state.filters,
      error,
    });
  }),

  on(
    PurchaseQuotesActions.LoadPurchaseQuotesSuccess,
    (state, { sales, pagination }) => {
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
    }
  ),

  on(PurchaseQuotesActions.UpdatePurchaseQuoteSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      selectedPurchase: payload.changes,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(PurchaseQuotesActions.GetPurchaseQuoteSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedPurchase: payload,
      error: null,
    })
  ),

  on(PurchaseQuotesActions.ResetSelectedPurchaseQuote, (state) => {
    return {
      ...state,
      selectedPurchase: null,
    };
  }),

  on(PurchaseQuotesActions.GetSalesAdvisorSuccess, (state, { payload }) => {
    const salesAdvisor = payload;
    return {
      ...state,
      salesAdvisor,
    };
  }),

  on(PurchaseQuotesActions.GetBrandsAndSeries, (state) => {
    return {
      ...state,
      unit: null,
    };
  }),

  on(PurchaseQuotesActions.GetBrandsAndSeriesSuccess, (state, { payload }) => {
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

  on(PurchaseQuotesActions.GetSeriesModels, (state) => {
    return {
      ...state,
      unit: {
        ...state.unit,
        models: null,
        variants: null,
      },
    };
  }),

  on(PurchaseQuotesActions.GetSeriesModelsSuccess, (state, { payload }) => {
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

  on(PurchaseQuotesActions.GetVariantsSuccess, (state, { payload }) => {
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

  on(PurchaseQuotesActions.GetVariants, (state) => {
    return {
      ...state,
      loading: false,
      unit: {
        ...state.unit,
        variants: null,
      },
    };
  }),

  on(PurchaseQuotesActions.GetVariantsSuccess, (state, { payload }) => {
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

  on(PurchaseQuotesActions.ResetUnit, (state) => {
    return {
      ...state,
      unit: {
        ...state.unit,
        models: null,
        variants: null,
      },
    };
  }),

  on(PurchaseQuotesActions.GetGlobalBrandsSuccess, (state, { payload }) => {
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

  on(PurchaseQuotesActions.GetGlobalModelsSuccess, (state, { payload }) => {
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

  on(PurchaseQuotesActions.GetGlobalVariantsSuccess, (state, { payload }) => {
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
  state: PurchaseQuotesState | undefined,
  action: PurchaseQuotesActions.PurchaseQuotesActionsUnion
) {
  return purchaseQuotesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Sales uuids
export const selectPurchaseQuotesUuids = selectIds;

// select the dictionary of Sales entities
export const selectPurchaseQuotesEntities = selectEntities;

// select the array of Sales
export const selectAllPurchaseQuotes = selectAll;

// select the total Sales count
export const selectPurchaseQuotesTotal = selectTotal;
