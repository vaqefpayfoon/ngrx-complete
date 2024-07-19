import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CarModelsActions } from '../actions';

import { IModels } from '../../models';

export interface ModelsState extends EntityState<IModels.IDocument> {
  unit: IModels.IUnitList;
  tempImage: {
    url: {
      [gallery: string]: string;
    };
    index: number;
  };
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  selectedModel: IModels.IDocument;
  modified: boolean;
  error: any;
}

export const adapter: EntityAdapter<IModels.IDocument> = createEntityAdapter<
  IModels.IDocument
>({
  selectId: (model) => model.uuid,
});

export const initialState: ModelsState = adapter.getInitialState({
  unit: null,
  tempImage: null,
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  selectedModel: null,
  modified: false,
  error: null,
});

const modelsReducer = createReducer(
  initialState,

  on(CarModelsActions.SetModelsPage, (state, { payload }) => {
    const { page, limit } = payload;
    return {
      ...initialState,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    };
  }),

  on(CarModelsActions.LoadModels, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    CarModelsActions.LoadModelsFail,
    CarModelsActions.CreateModelFail,
    CarModelsActions.DeactivateModelFail,
    CarModelsActions.UpdateModelFail,
    CarModelsActions.UploadExteriorGalleryColorImageFail,
    CarModelsActions.UploadInteriorGalleryColorImageFail,
    CarModelsActions.UploadExteriorGalleryImagesFail,
    CarModelsActions.UploadInteriorGalleryColorImageFail,
    CarModelsActions.GetBrandsAndSeriesFail,
    (_, { payload }) => {
      const error = payload;

      return adapter.removeAll({
        ...initialState,
        loading: false,
        loaded: false,
        error,
      });
    }
  ),

  on(CarModelsActions.GetSeriesModelsFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loading: false, loaded: false, error };
  }),

  on(CarModelsActions.LoadModelsSuccess, (state, { models, pagination }) => {
    const { page, pages, limit, total } = pagination;
    return adapter.setAll(models, {
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

  on(CarModelsActions.CreateModelSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      modified: false,
      error: null,
    })
  ),

  on(CarModelsActions.UpdateModelSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      modified: false,
      error: null,
    })
  ),

  on(
    CarModelsActions.ActivateModelSuccess,
    CarModelsActions.DeactivateModelSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(CarModelsActions.ResetModelStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(CarModelsActions.ResetSelectedModel, (state) => {
    return {
      ...state,
      selectedModel: null,
    };
  }),

  on(
    CarModelsActions.UploadInteriorGalleryColorImage,
    CarModelsActions.UploadExteriorGalleryColorImage,
    CarModelsActions.UploadInteriorGalleryImages,
    CarModelsActions.UploadExteriorGalleryImages,
    (state, { payload }) => {
      const { index } = payload;
      return {
        ...state,
        tempImage: {
          url: null,
          index,
        },
      };
    }
  ),

  on(
    CarModelsActions.UploadInteriorGalleryColorImageSuccess,
    (state, { payload }) => {
      const url = {
        interior: payload,
      };
      return {
        ...state,
        loading: false,
        tempImage: {
          ...state.tempImage,
          url,
        },
      };
    }
  ),

  on(
    CarModelsActions.UploadExteriorGalleryColorImageSuccess,
    (state, { payload }) => {
      const url = {
        exterior: payload,
      };
      return {
        ...state,
        loading: false,
        tempImage: {
          ...state.tempImage,
          url,
        },
      };
    }
  ),

  on(
    CarModelsActions.UploadInteriorGalleryImagesSuccess,
    (state, { payload }) => {
      const url = {
        interiors: payload,
      };
      return {
        ...state,
        loading: false,
        tempImage: {
          ...state.tempImage,
          url,
        },
      };
    }
  ),

  on(
    CarModelsActions.UploadExteriorGalleryImagesSuccess,
    (state, { payload }) => {
      const url = {
        exteriors: payload,
      };
      return {
        ...state,
        loading: false,
        tempImage: {
          ...state.tempImage,
          url,
        },
      };
    }
  ),

  on(CarModelsActions.SetBranchesSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(
    CarModelsActions.GetModelImageSuccess,
    CarModelsActions.GetModelSuccess,
    (state, { payload }) =>
      adapter.upsertOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        selectedModel: payload,
        error: null,
      })
  ),

  on(CarModelsActions.GetBrandsAndSeries, (state) => {
    return {
      ...state,
      unit: null,
    };
  }),

  on(CarModelsActions.GetBrandsAndSeriesSuccess, (state, { payload }) => {
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

  on(CarModelsActions.GetSeriesModels, (state) => {
    return {
      ...state,
      unit: {
        ...state.unit,
        models: null,
        variants: null,
      },
    };
  }),

  on(CarModelsActions.GetSeriesModelsSuccess, (state, { payload }) => {
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

  on(CarModelsActions.GetVariantsSuccess, (state, { payload }) => {
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

  on(CarModelsActions.GetVariants, (state) => {
    return {
      ...state,
      loading: false,
      unit: {
        ...state.unit,
        variants: null,
      },
    };
  }),

  on(CarModelsActions.GetVariantsSuccess, (state, { payload }) => {
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

  on(CarModelsActions.ResetUnit, (state) => {
    return {
      ...state,
      unit: {
        ...state.unit,
        models: null,
        variants: null,
      },
    };
  }),

  on(CarModelsActions.SelectModelImageSuccess, (state, { payload }) => {
    const url = payload;
    return {
      ...state,
      loading: false,
      tempImage: {
        url: {
          modelImage: url,
        },
        index: -1,
      },
    };
  })
);

export function reducer(
  state: ModelsState | undefined,
  action: CarModelsActions.CarModelsActionsUnion
) {
  return modelsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Models uuids
export const selectModelsUuids = selectIds;

// select the dictionary of Models entities
export const selectModelsEntities = selectEntities;

// select the array of Models
export const selectAllModels = selectAll;

// select the total Models count
export const selectModelsTotal = selectTotal;
