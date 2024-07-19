import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CampaignTemplatesActions } from '../actions';

import { ITemplates } from '../../models';

export interface CampaignTemplatesState
  extends EntityState<ITemplates.IDocument> {
  total: number;
  filters: ITemplates.IFilter[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedCampaignTemplate: ITemplates.IDocument;
  loaded: boolean;
  loading: boolean;
  images: string[];
  error: any;
}

export const adapter: EntityAdapter<ITemplates.IDocument> = createEntityAdapter<
  ITemplates.IDocument
>({
  selectId: template => template.uuid
});

export const initialState: CampaignTemplatesState = adapter.getInitialState({
  total: 0,
  filters: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedCampaignTemplate: null,
  loaded: false,
  loading: false,
  images: [],
  error: null
});

const templatesReducer = createReducer(
  initialState,

  on(
    CampaignTemplatesActions.SetCampaignTemplatesPage,
    (state, { payload }) => {
      const {
        config: { page, limit },
        filters
      } = payload;

      return {
        ...initialState,
        pagination: {
          ...state.pagination,
          page,
          limit
        },
        filters
      };
    }
  ),

  on(CampaignTemplatesActions.LoadCampaignTemplates, state => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null
    };
  }),

  on(
    CampaignTemplatesActions.GetCampaignTemplateSuccess,
    (state, { payload }) => {
      return adapter.upsertOne(payload, {
        ...state,
        selectedCampaignTemplate: payload,
        error: null
      });
    }
  ),

  on(
    CampaignTemplatesActions.LoadCampaignTemplatesFail,
    CampaignTemplatesActions.GetCampaignTemplateFail,
    CampaignTemplatesActions.DeletetCampaignTemplateFail,
    CampaignTemplatesActions.ActivateCampaignTemplateFail,
    CampaignTemplatesActions.DeactivateCampaignTemplateFail,
    CampaignTemplatesActions.UpdateCampaignTemplateFail,
    CampaignTemplatesActions.CreateCampaignFromMasterTemplateFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    CampaignTemplatesActions.LoadCampaignTemplatesSuccess,
    (state, { templates, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(templates, {
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
    CampaignTemplatesActions.DeletetCampaignTemplateSuccess,
    (state, { payload }) => {
      return adapter.removeOne(payload.uuid, {
        ...state,
        total: state.total - 1,
        loading: false,
        loaded: true
      });
    }
  ),

  on(
    CampaignTemplatesActions.ActivateCampaignTemplatesSuccess,
    CampaignTemplatesActions.DeactivateCampaignTemplateSuccess,
    CampaignTemplatesActions.ResetCampaignTemplateStatus,
    CampaignTemplatesActions.UpdateCampaignTemplateSuccess,
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
    CampaignTemplatesActions.CreateCampaignTemplateSuccess,
    CampaignTemplatesActions.CreateCampaignFromMasterTemplateSuccess,
    (state, { payload }) => {
      return adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(CampaignTemplatesActions.ResetSelectedCampaignTemplate, (state) => {
    return {
      ...state,
      selectedCampaignTemplate: null,
    };
  }),

  on(
    CampaignTemplatesActions.UploadCampaignTemplateImageSuccess,
    (state, { payload }) => {
      const myImages = [...state.images, payload];

      return {
        ...state,
        images: [...new Set(myImages)],
      };
    }
  )
);

export function reducer(
  state: CampaignTemplatesState | undefined,
  action: CampaignTemplatesActions.CampaignTemplatesActionsUnion
) {
  return templatesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Templates uuids
export const selectCampaignTemplatesUuids = selectIds;

// select the dictionary of Templates entities
export const selectCampaignTemplatesEntities = selectEntities;

// select the array of Templates
export const selectAllCampaignTemplates = selectAll;

// select the total Templates count
export const selectCampaignTemplatesTotal = selectTotal;
