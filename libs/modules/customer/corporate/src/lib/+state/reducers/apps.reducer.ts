import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { AppsActions } from '../actions';

import { IApps } from '../../models';

export interface AppsState extends EntityState<IApps.IDocument> {
  corporateUuid: string;
  token: string | null;
  selectedApp: IApps.IDocument | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<IApps.IDocument> = createEntityAdapter<
  IApps.IDocument
>({
  selectId: app => app.uuid,
  sortComparer: sortByName
});

export const initialState: AppsState = adapter.getInitialState({
  corporateUuid: null,
  token: null,
  selectedApp: null,
  loading: false,
  loaded: false,
  error: null
});

export function sortByName(a: IApps.IDocument, b: IApps.IDocument): number {
  return a.name.localeCompare(b.name);
}

const appsReducer = createReducer(
  initialState,

  on(AppsActions.SetCorporateAppsPage, (state, { payload }) => {
    const { corporateUuid } = payload;
    return adapter.removeAll({
      ...state,
      corporateUuid,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    AppsActions.LoadCorporateAppsFail,
    AppsActions.CreateCorporateAppFail,
    AppsActions.UpdateCorporateAppFail,
    AppsActions.ActivateCorporateAppFail,
    AppsActions.DeactivateCorporateAppFail,
    AppsActions.LoadCorporateAppFail,
    AppsActions.RegenerateCorporateAppTokenFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(AppsActions.LoadCorporateAppsSuccess, (state, { payload }) => {
    return adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(AppsActions.CreateCorporateApp, AppsActions.UpdateCorporateApp, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(
    AppsActions.CreateCorporateAppSuccess,
    (state, { payload: { corporateApp, token } }) =>
      adapter.addOne(corporateApp, {
        ...state,
        token,
        loading: false,
        loaded: true,
        error: null
      })
  ),

  on(AppsActions.RegenerateCorporateAppToken, state => {
    return { ...state, token: null };
  }),

  on(AppsActions.RegenerateCorporateAppTokenSuccess, (state, { payload }) => {
    const token = payload;

    return { ...state, token, error: null };
  }),

  on(AppsActions.UpdateCorporateAppSuccess, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),

  on(AppsActions.LoadCorporateAppSuccess, (state, { payload }) => {
    const selectedApp = payload;

    return {
      ...state,
      selectedApp,
      error: null
    };
  }),

  on(
    AppsActions.ActivateCorporateAppSuccess,
    AppsActions.DeactivateCorporateAppSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(AppsActions.ResetCorporateAppStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(AppsActions.ResetCorporateAppToken, state => {
    return {
      ...state,
      token: null,
      loading: false,
      error: null
    };
  }),

  on(AppsActions.ResetSelectedApp, (state) => {
    return {
      ...state,
      selectedApp: null
    };
  }),
);

export function reducer(
  state: AppsState | undefined,
  action: AppsActions.CorporateAppsActionsUnion
) {
  return appsReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Apps uuids
export const selectAppsUuids = selectIds;

// select the dictionary of Apps entities
export const selectAppsEntities = selectEntities;

// select the array of Apps
export const selectAllApps = selectAll;

// select the total Apps count
export const selectAppsTotal = selectTotal;
