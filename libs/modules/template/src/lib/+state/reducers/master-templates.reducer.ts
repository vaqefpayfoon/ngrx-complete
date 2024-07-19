import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { MasterTemplatesActions } from '../actions';

import { ITemplates } from '../../models';

export interface MasterTemplatesState
  extends EntityState<ITemplates.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages?: number;
  };
  filters: ITemplates.IFilter[];
  selectedMasterTemplate: ITemplates.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<ITemplates.IDocument> = createEntityAdapter<
  ITemplates.IDocument
>({
  selectId: template => template.uuid
});

export const initialState: MasterTemplatesState = adapter.getInitialState({
  pagination: null,
  total: 0,
  filters: null,
  selectedMasterTemplate: null,
  loaded: false,
  loading: false,
  error: null
});

const masterTemplatesReducer = createReducer(
  initialState,

  on(MasterTemplatesActions.SetMasterTemplatesPage, (_, { payload }) => {
    const {
      filters,
      config: { limit, page }
    } = payload;
    return {
      ...initialState,
      filters,
      pagination: {
        limit,
        page
      }
    };
  }),

  on(MasterTemplatesActions.LoadMasterTemplates, state => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null
    };
  }),

  on(
    MasterTemplatesActions.CreateMasterTemplateSuccess,
    (state, { payload }) => {
      return adapter.addOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(
    MasterTemplatesActions.LoadMasterTemplatesSuccess,
    (state, { templates, pagination }) => {
      const { total } = pagination;
      return adapter.addAll(templates, {
        ...state,
        total,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(MasterTemplatesActions.GetMasterTemplateSuccess, (state, { payload }) => {
    return adapter.upsertOne(payload, {
      ...state,
      selectedMasterTemplate: payload,
      error: null
    });
  }),

  on(
    MasterTemplatesActions.LoadMasterTemplatesFail,
    MasterTemplatesActions.CreateMasterTemplateFail,
    MasterTemplatesActions.GetMasterTemplateFail,
    MasterTemplatesActions.DeletetMasterTemplateFail,
    MasterTemplatesActions.ActivateMasterTemplateFail,
    MasterTemplatesActions.DeactivateMasterTemplateFail,
    MasterTemplatesActions.UpdateMasterTemplateFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    MasterTemplatesActions.LoadMasterTemplatesSuccess,
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
    MasterTemplatesActions.DeletetMasterTemplateSuccess,
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
    MasterTemplatesActions.ActivateMasterTemplatesSuccess,
    MasterTemplatesActions.DeactivateMasterTemplateSuccess,
    MasterTemplatesActions.ResetMasterTemplateStatus,
    MasterTemplatesActions.UpdateMasterTemplateSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(MasterTemplatesActions.ResetSelectedMasterTemplate, (state) => {
    return {
      ...state,
      selectedMasterTemplate: null,
    };
  })
);

export function reducer(
  state: MasterTemplatesState | undefined,
  action: MasterTemplatesActions.MasterTemplatesActionsUnion
) {
  return masterTemplatesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Master Templates uuids
export const selectMasterTemplatesUuids = selectIds;

// select the dictionary of Master Templates entities
export const selectMasterTemplatesEntities = selectEntities;

// select the array of Master Templates
export const selectAllMasterTemplates = selectAll;

// select the total Master Templates count
export const selectMasterTemplatesTotal = selectTotal;
