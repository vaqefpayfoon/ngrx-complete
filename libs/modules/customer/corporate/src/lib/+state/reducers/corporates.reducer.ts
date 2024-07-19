import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CorporatesActions } from '../actions';

import { ICorporates } from '../../models';
import { Auth } from '@neural/auth';

export interface CorporateState extends EntityState<ICorporates.IDocument> {
  selectedCorporate: ICorporates.IDocument | null;
  socialImage: {
    url: string;
    index: number;
  };
  appImage: {
    [file: string]: string;
  };
  operations: Auth.IAccount[];
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<ICorporates.IDocument> = createEntityAdapter<
  ICorporates.IDocument
>({
  selectId: (corporate) => corporate.uuid,
  sortComparer: sortByName,
});

export const initialState: CorporateState = adapter.getInitialState({
  selectedCorporate: null,
  socialImage: null,
  total: 0,
  appImage: null,
  operations: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
  },
  loaded: false,
  loading: false,
  error: null,
});

export function sortByName(
  a: ICorporates.IDocument,
  b: ICorporates.IDocument
): number {
  return a.name.localeCompare(b.name);
}

const corporateReducer = createReducer(
  initialState,

  on(CorporatesActions.SetCorporatesPage, (state, { payload }) => {
    const { page, limit } = payload;
    return adapter.removeAll({
      ...state,
      pagination: {
        ...state.pagination,
        page,
        limit,
      },
    });
  }),

  on(CorporatesActions.LoadCorporates, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),

  on(CorporatesActions.LoadCorporate, (state) => ({
    ...state,
    socialImage: null,
    appImage: null,
    loaded: false,
    error: null,
  })),

  on(CorporatesActions.SelectCorporate, (state, { payload }) => {
    return {
      ...state,
      selectedCorporate: payload,
      loading: false,
      loaded: true,
      error: null,
    };
  }),

  on(CorporatesActions.LoadCorporateSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedCorporate: payload,
      error: null,
    })
  ),

  on(
    CorporatesActions.ActivateCorporateSuccess,
    CorporatesActions.DeactivateCorporateSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(
    CorporatesActions.LoadCorporatesSuccess,
    (state, { corporates, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(corporates, {
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

  on(
    CorporatesActions.GetCorporateOperationsSuccess,
    (state, { payload }) => {
      const operations = payload;
      return {
        ...state,
        operations,
        error: null,
      };
    }
  ),

  on(
    CorporatesActions.LoadCorporatesFail,
    CorporatesActions.LoadCorporateFail,
    CorporatesActions.ActivateCorporateFail,
    CorporatesActions.DeactivateCorporateFail,
    CorporatesActions.UpdateCorporateImageFail,
    CorporatesActions.CreateCorporateFail,
    CorporatesActions.UpdateCorporateFail,
    CorporatesActions.UploadSocialIconFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(
    CorporatesActions.CreateCorporate,
    CorporatesActions.UpdateCorporate,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(CorporatesActions.CreateCorporateSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: false,
      error: null,
    });
  }),

  on(CorporatesActions.UpdateCorporateImageSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(CorporatesActions.UpdateCorporateSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  }),

  on(CorporatesActions.ResetCorporateStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(CorporatesActions.ResetSelectedCorporate, (state) => ({
    ...state,
    selectedCorporate: null,
  })),

  on(CorporatesActions.UploadSocialIcon, (state, { payload }) => {
    const { index } = payload;
    return {
      ...state,
      socialImage: {
        url: null,
        index,
      },
    };
  }),

  on(CorporatesActions.UploadSocialIconSuccess, (state, { payload }) => {
    const url = payload;
    return {
      ...state,
      loading: false,
      socialImage: {
        ...state.socialImage,
        url,
      },
    };
  }),

  on(CorporatesActions.UploadAppImage, (state, { payload }) => {
    const { key } = payload;
    return {
      ...state,
      appImage: {
        ...state.appImage,
        [key]: null,
      },
    };
  }),

  on(CorporatesActions.UploadAppImageSuccess, (state, { payload }) => {
    const url = payload;
    return {
      ...state,
      loading: false,
      appImage: {
        ...state.appImage,
        ...url
      },
    };
  }),
);

export function reducer(
  state: CorporateState | undefined,
  action: CorporatesActions.CorporatesActionsUnion
) {
  return corporateReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Corporates uuids
export const selectCorporatesUuids = selectIds;

// select the dictionary of Corporates entities
export const selectCorporatesEntities = selectEntities;

// select the array of Corporates
export const selectAllCorporates = selectAll;

// select the total Corporates count
export const selectCorporatesTotal = selectTotal;
