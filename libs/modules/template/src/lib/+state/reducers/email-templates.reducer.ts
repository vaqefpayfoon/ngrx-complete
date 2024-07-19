import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { EmailTemplatesActions } from '../actions';

import { ITemplates } from '../../models';

export interface EmailTemplatesState extends EntityState<ITemplates.IDocument> {
  total: number;
  filters: ITemplates.IFilter[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedEmailTemplate: ITemplates.IDocument;
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

export const initialState: EmailTemplatesState = adapter.getInitialState({
  total: 0,
  filters: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedEmailTemplate: null,
  loaded: false,
  loading: false,
  images: [],
  error: null
});

const templatesReducer = createReducer(
  initialState,

  on(EmailTemplatesActions.SetEmailTemplatesPage, (state, { payload }) => {
    const {
      config: { page, limit },
      filters
    } = payload;
    return {
      ...initialState,
      filters,
      pagination: {
        ...state.pagination,
        page,
        limit
      }
    };
  }),

  on(EmailTemplatesActions.LoadEmailTemplates, state => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null
    };
  }),

  on(EmailTemplatesActions.GetEmailTemplateSuccess, (state, { payload }) => {
    return adapter.upsertOne(payload, {
      ...state,
      selectedEmailTemplate: payload,
      error: null
    });
  }),

  on(
    EmailTemplatesActions.LoadEmailTemplatesFail,
    EmailTemplatesActions.GetEmailTemplateFail,
    EmailTemplatesActions.DeletetEmailTemplateFail,
    EmailTemplatesActions.ActivateEmailTemplateFail,
    EmailTemplatesActions.DeactivateEmailTemplateFail,
    EmailTemplatesActions.UpdateEmailTemplateFail,
    EmailTemplatesActions.CreateEmailFromMasterTemplateFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    EmailTemplatesActions.LoadEmailTemplatesSuccess,
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
    EmailTemplatesActions.DeletetEmailTemplateSuccess,
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
    EmailTemplatesActions.ActivateEmailTemplatesSuccess,
    EmailTemplatesActions.DeactivateEmailTemplateSuccess,
    EmailTemplatesActions.ResetEmailTemplateStatus,
    EmailTemplatesActions.UpdateEmailTemplateSuccess,
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
    EmailTemplatesActions.CreateEmailTemplateSuccess,
    EmailTemplatesActions.CreateEmailFromMasterTemplateSuccess,
    (state, { payload }) => {
      return adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(EmailTemplatesActions.ResetSelectedEmailTemplate, (state) => {
    return {
      ...state,
      selectedEmailTemplate: null,
    };
  }),

  on(
    EmailTemplatesActions.UploadEmailTemplateImageSuccess,
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
  state: EmailTemplatesState | undefined,
  action: EmailTemplatesActions.EmailTemplatesActionsUnion
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
export const selectEmailTemplatesUuids = selectIds;

// select the dictionary of Templates entities
export const selectEmailTemplatesEntities = selectEntities;

// select the array of Templates
export const selectAllEmailTemplates = selectAll;

// select the total Templates count
export const selectEmailTemplatesTotal = selectTotal;
