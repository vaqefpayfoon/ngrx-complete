import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { VehiclesActions } from '../actions';

import { IVehicle } from '../../models';

import { IError } from '@neural/shared/data';

export interface VehiclesState extends EntityState<IVehicle.IDocument> {
  selectedVehicleUuid: string | null;
  selectedVehicle: IVehicle.IDocument;
  searchedVehicle: IVehicle.IDocument;
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  tyre: IVehicle.ITyre;
  rearTyre: IVehicle.ITyre;
  filter: IVehicle.IFilter;
  sort: IVehicle.ISort;
  list: {
    brands: string[];
    models: string[];
    variants: IVehicle.IVariants[];
  };
  vehicleloaded: boolean;
  loaded: boolean;
  loading: boolean;
  error: IError;
}

export const adapter: EntityAdapter<IVehicle.IDocument> = createEntityAdapter<
  IVehicle.IDocument
>({
  selectId: (vehicle) => vehicle.uuid,
  sortComparer: sortByNumber,
});

export const initialState: VehiclesState = adapter.getInitialState({
  selectedVehicleUuid: null,
  selectedVehicle: null,
  searchedVehicle: null,
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  tyre: null,
  rearTyre: null,
  filter: null,
  sort: null,
  list: {
    brands: null,
    models: null,
    variants: null,
  },
  vehicleloaded: false,
  loaded: false,
  loading: false,
  error: null,
});

export function sortByNumber(
  a: IVehicle.IDocument,
  b: IVehicle.IDocument
): number {
  return a.numberPlate.localeCompare(b.numberPlate);
}

export const vehiclesReducer = createReducer(
  initialState,

  on(VehiclesActions.SetVehiclesPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...state,
      error: null,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),

  on(VehiclesActions.LoadVehicles, (state) => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    });
  }),

  on(VehiclesActions.ChangeVehiclesPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...state,
      error: null,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),

  on(VehiclesActions.FilterVehicles, (state, { payload }) => {
    return {
      ...state,
      error: null,
      filter: payload,
    };
  }),

  on(VehiclesActions.ResetFilterVehicles, (state) => {
    return {
      ...state,
      error: null,
      filter: null,
    };
  }),

  on(VehiclesActions.ResetSortVehicles, (state) => {
    return {
      ...state,
      error: null,
      sort: null,
    };
  }),

  on(VehiclesActions.SortVehicles, (state, { payload }) => {
    return {
      ...state,
      error: null,
      sort: payload,
    };
  }),

  on(
    VehiclesActions.LoadVehiclesFail,
    VehiclesActions.GetVehicleFail,
    VehiclesActions.ActivateVehicleFail,
    VehiclesActions.DeactivateVehicleFail,
    VehiclesActions.UpdateVehicleFail,
    VehiclesActions.TyreWidthsFail,
    VehiclesActions.TyreAspectRatiosFail,
    VehiclesActions.TyreRimsFail,
    VehiclesActions.LoadVehicleBrandsFail,
    VehiclesActions.LoadVehicleModelsFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        error,
      };
    }
  ),

  on(
    VehiclesActions.RearTyreWidthsFail,
    VehiclesActions.RearTyreAspectRatiosFail,
    VehiclesActions.RearTyreRimsFail,
    (state, { payload }) => {
      const error = payload;

      return {
        ...state,
        loaded: false,
        loading: false,
        error,
      };
    }
  ),

  on(VehiclesActions.LoadVehicleVariantsFail, (state, { payload }) => {
    const error = payload;

    return {
      ...state,
      loaded: false,
      loading: false,
      error,
    };
  }),

  on(VehiclesActions.LoadVehiclesSuccess, (state, { vehicles, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(vehicles, {
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
    VehiclesActions.ActivateVehicleSuccess,
    VehiclesActions.DeactivateVehicleSuccess,
    (state, { payload }) => {
      const { active } = payload.changes;

      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        searchedVehicle: {
          ...state.searchedVehicle,
          active
        },
        error: null,
      });
    }
  ),

  on(VehiclesActions.GetVehicle, (state, { payload }) => {
    return {
      ...state,
      error: null,
      selectedVehicleUuid: payload,
    };
  }),

  on(
    VehiclesActions.LoadVehiclesInspectionsSuccess,
    (state, { inspections, pagination }) => {
      return {
        ...state,
        loading: false,
        error: null,
        [!!state.selectedVehicle ? 'selectedVehicle' : 'searchedVehicle']: {
          ...(state.selectedVehicle ?? state.searchedVehicle),
          inspections,
          pagination,
        },
      };
    }
  ),

  on(VehiclesActions.GetVehicleSuccess, (state, { payload }) => {
    return {
      ...state,
      loading: false,
      vehicleloaded: false,
      error: null,
      selectedVehicle: payload,
    };
  }),

  on(VehiclesActions.ResetSelectedVehicle, (state) => {
    return {
      ...state,
      selectedVehicle: null,
    };
  }),

  on(VehiclesActions.ResetSearchedVehicle, (state) => {
    return {
      ...state,
      searchedVehicle: null,
    };
  }),

  on(VehiclesActions.UpdateVehicle, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(VehiclesActions.UpdateVehicleSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(VehiclesActions.UpdateSearchedVehicleSuccess, (state, { payload }) => {
    return adapter.upsertOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(
    VehiclesActions.TyreWidths,
    VehiclesActions.TyreAspectRatios,
    VehiclesActions.TyreRims,
    VehiclesActions.RearTyreWidths,
    VehiclesActions.RearTyreAspectRatios,
    VehiclesActions.RearTyreRims,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(VehiclesActions.TyreWidthsSuccess, (state, { payload }) => ({
    ...state,
    tyre: {
      ...state.tyre,
      widths: payload,
    },
    error: null,
  })),

  on(VehiclesActions.TyreAspectRatiosSuccess, (state, { payload }) => ({
    ...state,
    tyre: {
      ...state.tyre,
      aspectRatios: payload,
    },
    loading: false,
    error: null,
  })),

  on(VehiclesActions.TyreRimsSuccess, (state, { payload }) => ({
    ...state,
    tyre: {
      ...state.tyre,
      rims: payload,
    },
    loading: false,
    error: null,
  })),

  on(VehiclesActions.RearTyreWidthsSuccess, (state, { payload }) => ({
    ...state,
    rearTyre: {
      ...state.rearTyre,
      widths: payload,
    },
    error: null,
  })),

  on(VehiclesActions.RearTyreAspectRatiosSuccess, (state, { payload }) => ({
    ...state,
    rearTyre: {
      ...state.rearTyre,
      aspectRatios: payload,
    },
    loading: false,
    error: null,
  })),

  on(VehiclesActions.RearTyreRimsSuccess, (state, { payload }) => ({
    ...state,
    rearTyre: {
      ...state.rearTyre,
      rims: payload,
    },
    loading: false,
    error: null,
  })),

  on(VehiclesActions.ResetTyre, (state, { payload }) => ({
    ...state,
    tyre: {
      ...state.tyre,
      [payload]: null,
    },
    rearTyre: {
      ...state.rearTyre,
      [payload]: null,
    }
  })),

  on(VehiclesActions.ResetList, (state, { payload }) => ({
    ...state,
    list: {
      ...state.list,
      [payload]: null,
    },
  })),

  on(
    VehiclesActions.LoadVehicleBrands,
    VehiclesActions.LoadVehicleModels,
    VehiclesActions.LoadVehicleVariants,
    (state) => ({
      ...state,
      error: null,
    })
  ),

  on(VehiclesActions.LoadVehicleBrandsSuccess, (state, { payload }) => {
    const brands = payload;
    return {
      ...state,
      list: {
        ...state.list,
        brands,
      },
      error: null,
    };
  }),

  on(VehiclesActions.LoadVehicleModelsSuccess, (state, { payload }) => {
    const models = payload;
    return {
      ...state,
      list: {
        ...state.list,
        models,
      },
      loading: false,
      error: null,
    };
  }),

  on(VehiclesActions.LoadVehicleVariantsSuccess, (state, { payload }) => {
    const variants = payload;
    return {
      ...state,
      list: {
        ...state.list,
        variants,
      },
      loading: false,
      error: null,
    };
  }),

  on(VehiclesActions.ResetVehicleStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(VehiclesActions.ResetSearchedVehicleStatus, (state, { payload }) => {
    const { active } = payload.changes;
    
    return adapter.updateOne(payload, {
      ...state,
      searchedVehicle: {
        ...state.searchedVehicle,
        active
      },
      error: null,
    })  
  }
  ),

  on(
    VehiclesActions.SearchVehicleByNumberPlate,
    VehiclesActions.ResetVehicleItem,
    (state) => {
      return {
        ...state,
        searchedVehicle: null,
        selectedVehicle: null,
      };
    }
  ),

  on(
    VehiclesActions.SearchVehicleByNumberPlateSuccess,
    (state, { payload }) => {
      const searchedVehicle = payload;
      return {
        ...state,
        searchedVehicle,
        loading: false,
      };
    }
  )
);

export function reducer(
  state: VehiclesState | undefined,
  action: VehiclesActions.VehiclesActionsUnion
) {
  return vehiclesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Vehicles uuids
export const selectVehiclesUuids = selectIds;

// select the dictionary of Vehicles entities
export const selectVehiclesEntities = selectEntities;

// select the array of Vehicless
export const selectAllVehicles = selectAll;

// select the total Vehicles count
export const selectVehiclesTotal = selectTotal;
