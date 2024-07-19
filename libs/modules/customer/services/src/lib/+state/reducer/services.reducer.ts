import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

import { ServicesActions } from '../actions';

import { IServices } from '../../models';

export interface ServicesState extends EntityState<IServices.IDocument> {
  category: string | null;
  selectedService: IServices.IDocument;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IServices.IDocument> = createEntityAdapter<
  IServices.IDocument
>({
  selectId: service => service.uuid,
  sortComparer: sortByName
});

export const initialState: ServicesState = adapter.getInitialState({
  category: null,
  selectedService: null,
  loaded: false,
  loading: false,
  error: null
});

export function sortByName(
  a: IServices.IDocument,
  b: IServices.IDocument
): number {
  return a.title.localeCompare(b.title);
}

const servicesReducer = createReducer(
  initialState,

  on(ServicesActions.SelectCategory, (state, { payload }) => {
    const category = payload;
    return {
      ...state,
      category,
      error: null
    };
  }),
  
  on(ServicesActions.LoadServices, (state) => {
    return adapter.removeAll({
      ...state,
      loading: true,
      loaded: false,
      error: null
    });
  }),

  on(
    ServicesActions.ActivateServiceSuccess,
    ServicesActions.DeactivateServiceSuccess,
    (state, { payload }) => {
      return adapter.updateOne(payload, {
        ...state,
        loading: false,
        loaded: true,
        error: null
      });
    }
  ),

  on(ServicesActions.LoadServicesSuccess, (state, { payload }) => {
    return adapter.addAll(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(
    ServicesActions.LoadServicesFail,
    ServicesActions.ActivateServiceFail,
    ServicesActions.DeactivateServiceFail,
    ServicesActions.CreateServiceFail,
    ServicesActions.UpdateServiceFail,
    ServicesActions.DeactivateServiceFail,
    ServicesActions.GetServiceFail,
    (state, { payload }) => {
      const error = payload;

      return { ...state, loaded: false, loading: false, error };
    }
  ),

  on(ServicesActions.GetServiceSuccess, (state, { payload }) =>
    adapter.upsertOne(payload, {
      ...state,
      selectedService: payload,
      error: null,
    })
  ),

  on(ServicesActions.ResetServiceStatus, (state, { payload }) =>
    adapter.updateOne(payload, {
      ...state,
      loading: false,
      error: null
    })
  ),

  on(ServicesActions.CreateService, ServicesActions.UpdateService, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ServicesActions.CreateServiceSuccess, (state, { payload }) => {
    return adapter.addOne(payload, {
      ...state,
      loading: false,
      loaded: false,
      error: null
    });
  }),

  on(ServicesActions.UpdateServiceSuccess, (state, { payload }) => {
    return adapter.updateOne(payload, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    });
  }),

  on(ServicesActions.ResetSelectedService, (state) => {
    return {
      ...state,
      selectedService: null,
    };
  }),
);

export function reducer(
  state: ServicesState | undefined,
  action: ServicesActions.ServicesActionsUnion
) {
  return servicesReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();

// select the array of Fleets uuids
export const selectServicesUuids = selectIds;

// select the dictionary of Fleets entities
export const selectServicesEntities = selectEntities;

// select the array of Fleets
export const selectAllServices = selectAll;

// select the total Fleets count
export const selectServicesTotal = selectTotal;
