import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromServices from './services.reducer';

export interface IServicesState {
  readonly service: fromServices.ServicesState;
}

export const REDUCERS: ActionReducerMap<IServicesState> = {
  service: fromServices.reducer
};

export const getServiceState = createFeatureSelector<IServicesState>(
  'service'
);
