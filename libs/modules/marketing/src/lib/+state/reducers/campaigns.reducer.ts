import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { CampaignsActions } from '../actions';

import { ICampaigns } from '../../models';

export interface CampaignsState extends EntityState<ICampaigns.IDocument> {
  total: number;
  pagination: {
    limit: number;
    page: number;
    pages: number;
    name?: string;
    active?: boolean;
    _id: number;
  };
  selectedCampaign: ICampaigns.IDocument;
  images: string[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<ICampaigns.IDocument> = createEntityAdapter<
  ICampaigns.IDocument
>({
  selectId: (campaigns) => campaigns.uuid,
});

export const initialState: CampaignsState = adapter.getInitialState({
  total: 0,
  pagination: {
    limit: 10,
    page: 1,
    pages: 1,
    name: '',
    active: false,
    _id: 1,
  },
  images: [],
  selectedCampaign: null,
  loaded: false,
  loading: false,
  error: null,
});

const campaignsReducer = createReducer(
  initialState,

  on(CampaignsActions.SetCampaignsPage, (state, { payload }) => {
    const { page, limit, name, active, _id } = payload;
    return adapter.removeAll({
      ...state,
      pagination: {
        ...state.pagination,
        page,
        limit,
        name,
        active,
        _id,
      },
    });
  }),

  on(CampaignsActions.LoadCampaigns, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),

  on(
    CampaignsActions.LoadCampaignsFail,
    CampaignsActions.GetCampaignFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loading: false, loaded: false, error };
    }
  ),

  on(
    CampaignsActions.LoadCampaignsSuccess,
    (state, { campaigns, pagination }) => {
      const { page, pages, limit, total } = pagination;
      return adapter.setAll(campaigns, {
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

  on(CampaignsActions.CreateCampaignSuccess, (state, { payload }) =>
    adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(CampaignsActions.UpdateCampaignSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(CampaignsActions.GetCampaignSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedCampaign: payload,
      error: null,
    })
  ),

  on(
    CampaignsActions.ActivateCampaignsSuccess,
    CampaignsActions.DeactivateCampaignSuccess,
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
    CampaignsActions.OnFeatureCampaignsSuccess,
    CampaignsActions.OffFeatureCampaignSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null,
      });
    }
  ),

  on(CampaignsActions.ResetCampaignStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(CampaignsActions.ResetSelectedCampaign, (state) => {
    return {
      ...state,
      selectedCampaign: null,
    };
  }),

  on(
    CampaignsActions.UploadCampaignContentImageSuccess,
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
  state: CampaignsState | undefined,
  action: CampaignsActions.CampaignsActionsUnion
) {
  return campaignsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the array of Campaigns uuids
export const selectCampaignsUuids = selectIds;

// select the dictionary of Campaigns entities
export const selectCampaignsEntities = selectEntities;

// select the array of Campaigns
export const selectAllCampaigns = selectAll;

// select the total Campaigns count
export const selectCampaignsTotal = selectTotal;
