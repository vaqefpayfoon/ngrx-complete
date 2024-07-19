import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CampaignTargetsActions } from '../actions';

import { ICampaignTargets } from '../../models';

export interface CampaignTargetsState
  extends EntityState<ICampaignTargets.IDocument> {
  total: number;
  filters: ICampaignTargets.IFilter[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
  };
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<
  ICampaignTargets.IDocument
> = createEntityAdapter<ICampaignTargets.IDocument>({
  selectId: campaignTarget => campaignTarget.uuid
});

export const initialState: CampaignTargetsState = adapter.getInitialState({
  total: 0,
  filters: null,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1
  },
  loaded: false,
  loading: false,
  error: null
});

const campaignTargetsReducer = createReducer(
  initialState,

  on(CampaignTargetsActions.SetCampaignTargetsPage, (state, { payload }) => {
    const {
      filters,
      config: { page, limit }
    } = payload;
    return adapter.removeAll({
      ...initialState,
      filters,
      pagination: {
        ...state.pagination,
        page,
        limit
      }
    });
  }),

  on(CampaignTargetsActions.LoadCampaignTargets, state => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null
    };
  }),

  on(CampaignTargetsActions.LoadCampaignTargetsFail, (state, { payload }) => {
    const error = payload;

    return adapter.removeAll({
      ...initialState,
      ...state,
      loading: false,
      loaded: false,
      error
    });
  }),

  on(
    CampaignTargetsActions.LoadCampaignTargetsSuccess,
    (state, { campaignTargets, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.addAll(campaignTargets, {
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
  )
);

export function reducer(
  state: CampaignTargetsState | undefined,
  action: CampaignTargetsActions.CampaignTargetActionsUnion
) {
  return campaignTargetsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Campaigns uuids
export const selectCampaignTargetsUuids = selectIds;

// select the dictionary of Campaigns entities
export const selectCampaignTargetsEntities = selectEntities;

// select the array of Campaigns
export const selectAllCampaignTargets = selectAll;

// select the total Campaigns count
export const selectCampaignTargetsTotal = selectTotal;
