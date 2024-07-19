import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { VehicleReferenceActions } from '../actions';

import { IVehicleReference } from '../../models';

export interface VehiclesReferenceState
  extends EntityState<IVehicleReference.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  list: {
    brands: string[];
    models: string[];
    variants: IVehicleReference.IVariants[];
  };
  filter: IVehicleReference.IFilter;
  sort: IVehicleReference.ISort;
  selectedVehicleReference: IVehicleReference.IDocument;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<
  IVehicleReference.IDocument
> = createEntityAdapter<IVehicleReference.IDocument>({
  selectId: vehicleReference => vehicleReference.uuid
});

export const initialState: VehiclesReferenceState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  list: {
    brands: null,
    models: null,
    variants: null
  },
  filter: null,
  sort: null,
  selectedVehicleReference: null,
  loaded: false,
  loading: false,
  error: null
});

export const vehiclesReferenceReducer = createReducer(
  initialState,

  on(VehicleReferenceActions.SetVehicleReferencePage, (state, { payload }) => {
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

  on(VehicleReferenceActions.LoadVehicleReference, state => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    VehicleReferenceActions.ChangeVehicleReferencePage,
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

  on(VehicleReferenceActions.FilterVehicleReference, (state, { payload }) => {
    return {
      ...state,
      error: null,
      filter: payload
    };
  }),

  on(VehicleReferenceActions.ResetFilterVehicleReference, state => {
    return {
      ...state,
      error: null,
      filter: null
    };
  }),

  on(VehicleReferenceActions.ResetSortVehicleReference, state => {
    return {
      ...state,
      error: null,
      sort: null
    };
  }),

  on(VehicleReferenceActions.SortVehicleReference, (state, { payload }) => {
    return {
      ...state,
      error: null,
      sort: payload
    };
  }),

  on(
    VehicleReferenceActions.LoadVehicleReferenceFail,
    VehicleReferenceActions.LoadVehicleReferenceBrandsFail,
    VehicleReferenceActions.LoadVehicleReferenceModelsFail,
    VehicleReferenceActions.LoadVehicleReferenceVariantsFail,
    VehicleReferenceActions.ActivateVehicleReferenceFail,
    VehicleReferenceActions.DeactivateVehicleReferenceFail,
    VehicleReferenceActions.CreateVehicleReferenceFail,
    VehicleReferenceActions.UpdateVehicleReference,
    VehicleReferenceActions.GetVehicleReferenceFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        error
      };
    }
  ),

  on(VehicleReferenceActions.GetVehicleReferenceSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedVehicleReference: payload,
      error: null,
    })
  ),

  on(
    VehicleReferenceActions.LoadVehicleReferenceSuccess,
    (state, { vehicleReference, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(vehicleReference, {
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
    VehicleReferenceActions.ActivateVehicleReferenceSuccess,
    VehicleReferenceActions.DeactivateVehicleReferenceSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(VehicleReferenceActions.UpdateVehicleReference, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(
    VehicleReferenceActions.CreateVehicleReferenceSuccess,
    (state, { payload }) => {
      return adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: false,
        error: null
      });
    }
  ),

  on(
    VehicleReferenceActions.UpdateVehicleReferenceSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(VehicleReferenceActions.ResetList, (state, { payload }) => ({
    ...state,
    list: {
      ...state.list,
      [payload]: null
    }
  })),

  on(
    VehicleReferenceActions.LoadVehicleReferenceBrands,
    VehicleReferenceActions.LoadVehicleReferenceModels,
    VehicleReferenceActions.LoadVehicleReferenceVariants,
    state => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    VehicleReferenceActions.LoadVehicleReferenceBrandsSuccess,
    (state, { payload }) => {
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
    }
  ),

  on(
    VehicleReferenceActions.LoadVehicleReferenceModelsSuccess,
    (state, { payload }) => {
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
    }
  ),

  on(
    VehicleReferenceActions.LoadVehicleReferenceVariantsSuccess,
    (state, { payload }) => {
      const variants = payload;
      return {
        ...state,
        list: {
          ...state.list,
          variants
        },
        loading: false,
        error: null
      };
    }
  ),

  on(
    VehicleReferenceActions.ResetVehicleReferenceStatus,
    (state, { payload }) =>
      adapter.updateOne(payload, {
        ...state,
        loading: false,
        error: null
      })
  ),

  on(VehicleReferenceActions.ResetSelectedVehicleReference, (state) => {
    return {
      ...state,
      selectedVehicleReference: null,
    };
  }),
);

export function reducer(
  state: VehiclesReferenceState | undefined,
  action: VehicleReferenceActions.VehicleReferenceActionsUnion
) {
  return vehiclesReferenceReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Vehicle References uuids
export const selectVehicleReferencesUuids = selectIds;

// select the dictionary of Vehicle References entities
export const selectVehicleReferencesEntities = selectEntities;

// select the array of Vehicles References
export const selectAllVehicleReferences = selectAll;

// select the total Vehicle References count
export const selectVehicleReferencesTotal = selectTotal;
