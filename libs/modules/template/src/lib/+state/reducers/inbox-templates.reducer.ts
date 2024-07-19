import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { InboxTemplatesActions } from '../actions';

import { ITemplates } from '../../models';

export interface InboxTemplatesState extends EntityState<ITemplates.IDocument> {
  total: number;
  filters: ITemplates.IFilter[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  selectedInboxTemplate: ITemplates.IDocument;
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

export const initialState: InboxTemplatesState = adapter.getInitialState({
  total: 0,
  filters: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  selectedInboxTemplate: null,
  loaded: false,
  loading: false,
  images: [],
  error: null
});

const templatesReducer = createReducer(
  initialState,

  on(InboxTemplatesActions.SetInboxTemplatesPage, (state, { payload }) => {
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

  on(InboxTemplatesActions.LoadInboxTemplates, state => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null
    };
  }),

  on(InboxTemplatesActions.GetInboxTemplateSuccess, (state, { payload }) => {
    return adapter.upsertOne(payload, {
      ...state,
      selectedInboxTemplate: payload,
      error: null
    });
  }),

  on(
    InboxTemplatesActions.LoadInboxTemplatesFail,
    InboxTemplatesActions.GetInboxTemplateFail,
    InboxTemplatesActions.DeletetInboxTemplateFail,
    InboxTemplatesActions.ActivateInboxTemplateFail,
    InboxTemplatesActions.DeactivateInboxTemplateFail,
    InboxTemplatesActions.UpdateInboxTemplateFail,
    InboxTemplatesActions.CreateInboxFromMasterTemplateFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    InboxTemplatesActions.LoadInboxTemplatesSuccess,
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
    InboxTemplatesActions.DeletetInboxTemplateSuccess,
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
    InboxTemplatesActions.ActivateInboxTemplatesSuccess,
    InboxTemplatesActions.DeactivateInboxTemplateSuccess,
    InboxTemplatesActions.ResetInboxTemplateStatus,
    InboxTemplatesActions.UpdateInboxTemplateSuccess,
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
    InboxTemplatesActions.CreateInboxTemplateSuccess,
    InboxTemplatesActions.CreateInboxFromMasterTemplateSuccess,
    (state, { payload }) => {
      return adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(InboxTemplatesActions.ResetSelectedInboxTemplate, (state) => {
    return {
      ...state,
      selectedInboxTemplate: null,
    };
  }),

  on(
    InboxTemplatesActions.UploadInboxTemplateImageSuccess,
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
  state: InboxTemplatesState | undefined,
  action: InboxTemplatesActions.InboxTemplatesActionsUnion
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
export const selectInboxTemplatesUuids = selectIds;

// select the dictionary of Templates entities
export const selectInboxTemplatesEntities = selectEntities;

// select the array of Templates
export const selectAllInboxTemplates = selectAll;

// select the total Templates count
export const selectInboxTemplatesTotal = selectTotal;
