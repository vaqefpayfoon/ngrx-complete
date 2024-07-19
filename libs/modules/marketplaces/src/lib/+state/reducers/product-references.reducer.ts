import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ProductReferencesActions } from '../actions';

import { IProductReferences } from '../../models';

export interface ReferencesState
  extends EntityState<IProductReferences.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedProductReference: IProductReferences.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<
  IProductReferences.IDocument
> = createEntityAdapter<IProductReferences.IDocument>({
  selectId: references => references.uuid
});

export const initialState: ReferencesState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedProductReference: null,
  loaded: false,
  loading: false,
  error: null
});

const referencesReducer = createReducer(
  initialState,

  on(
    ProductReferencesActions.SetProductReferencesPage,
    (state, { payload }) => {
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
    }
  ),

  on(ProductReferencesActions.LoadProductReferences, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),

  on(
    ProductReferencesActions.LoadProductReferencesSuccess,
    (state, { references, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(references, {
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
    ProductReferencesActions.LoadProductReferencesFail,
    ProductReferencesActions.ActivateProductReferenceFail,
    ProductReferencesActions.DeactivateProductReferenceFail,
    ProductReferencesActions.CreateProductReferenceFail,
    ProductReferencesActions.UpdateProductReferenceFail,
    ProductReferencesActions.GetProductReferenceFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(ProductReferencesActions.GetProductReferenceSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedProductReference: payload,
      error: null,
    })
  ),

  on(
    ProductReferencesActions.ActivateProductReferenceSuccess,
    ProductReferencesActions.DeactivateProductReferenceSuccess,
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
    ProductReferencesActions.CreateProductReference,
    ProductReferencesActions.UpdateProductReference,
    state => {
      return {
        ...state,
        loading: true,
        error: null
      };
    }
  ),

  on(
    ProductReferencesActions.CreateProductReferenceSuccess,
    (state, { payload }) =>
      adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(
    ProductReferencesActions.UpdateProductReferenceSuccess,
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
    ProductReferencesActions.ResetProductReferenceStatus,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        error: null
      })
  ),

  on(ProductReferencesActions.ResetSelectedProductReference, (state) => {
    return {
      ...state,
      selectedProductReference: null,
    };
  }),
);

export function reducer(
  state: ReferencesState | undefined,
  action: ProductReferencesActions.ProductReferencesActionsUnion
) {
  return referencesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of References uuids
export const selectReferencesUuids = selectIds;

// select the dictionary of References entities
export const selectReferencesEntities = selectEntities;

// select the array of References
export const selectAllReferences = selectAll;

// select the total References count
export const selectReferencesTotal = selectTotal;
