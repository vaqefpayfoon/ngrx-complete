import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ProductCoveragesActions } from '../actions';

import { IProductCoverages } from '../../models';

export interface CoveragesState
  extends EntityState<IProductCoverages.IDocument> {
  list: {
    brands: string[];
    models: IProductCoverages.IModel[];
  };
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedProductCoverage: IProductCoverages.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<
  IProductCoverages.IDocument
> = createEntityAdapter<IProductCoverages.IDocument>({
  selectId: coverages => coverages.uuid
});

export const initialState: CoveragesState = adapter.getInitialState({
  list: {
    brands: null,
    models: null
  },
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedProductCoverage: null,
  loaded: false,
  loading: false,
  error: null
});

const coveragesReducer = createReducer(
  initialState,

  on(ProductCoveragesActions.SetProductCoveragesPage, (state, { payload }) => {
    const { page, limit } = payload;
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

  on(ProductCoveragesActions.LoadProductCoverages, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    ProductCoveragesActions.LoadProductCoveragesSuccess,
    (state, { coverages, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(coverages, {
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
    ProductCoveragesActions.LoadProductCoveragesFail,
    ProductCoveragesActions.ActivateProductCoverageFail,
    ProductCoveragesActions.DeactivateProductCoverageFail,
    ProductCoveragesActions.CreateProductCoverageFail,
    ProductCoveragesActions.GetProductCoverageFail,
    ProductCoveragesActions.UpdateProductCoverageFail,
    ProductCoveragesActions.DeleteProductCoverageFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(ProductCoveragesActions.GetProductCoverageSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedProductCoverage: payload,
      error: null,
    })
  ),

  on(
    ProductCoveragesActions.ActivateProductCoverageSuccess,
    ProductCoveragesActions.DeactivateProductCoverageSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(
    ProductCoveragesActions.CreateProductCoverage,
    ProductCoveragesActions.UpdateProductCoverage,
    state => {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
  ),

  on(
    ProductCoveragesActions.CreateProductCoverageSuccess,
    (state, { payload }) =>
      adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(
    ProductCoveragesActions.UpdateProductCoverageSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(
    ProductCoveragesActions.DeleteProductCoverageSuccess,
    (state, { payload }) => {
      const { uuid } = payload;
      return adapter.removeOne(uuid, {
        ...state,
        total: state.total - 1,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(ProductCoveragesActions.ResetProductCoverageStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(ProductCoveragesActions.ResetSelectedProductCoverage, (state) => {
    return {
      ...state,
      selectedProductCoverage: null,
    };
  }),

  on(
    ProductCoveragesActions.LoadProductModels,
    ProductCoveragesActions.LoadProductBrands,
    state => ({
      ...state,
      error: null
    })
  ),

  on(ProductCoveragesActions.LoadProductBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      list: {
        ...state.list,
        brands
      },
      loading: false,
      error: null
    };
  }),

  on(ProductCoveragesActions.LoadProductModelsSuccess, (state, { payload }) => {
    const models = payload;
    return {
      ...state,
      list: {
        ...state.list,
        models
      },
      loading: false,
      error: null
    };
  }),

  on(ProductCoveragesActions.ResetList, (state, { payload }) => ({
    ...state,
    list: {
      ...state.list,
      [payload]: null
    }
  }))
);

export function reducer(
  state: CoveragesState | undefined,
  action: ProductCoveragesActions.ProductCoveragesActionsUnion
) {
  return coveragesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of coverages uuids
export const selectCoveragesUuids = selectIds;

// select the dictionary of coverages entities
export const selectCoveragesEntities = selectEntities;

// select the array of coverages
export const selectAllCoverages = selectAll;

// select the total coverages count
export const selectCoveragesTotal = selectTotal;
