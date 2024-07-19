import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromRouterStore from '@ngrx/router-store';

import * as fromRouter from './router.reducer';

import { IRouter } from '../models';

export class CustomSerializer extends fromRouter.CustomSerializer {}

export interface State {
  routerReducer: fromRouterStore.RouterReducerState<IRouter>;
}

export const REDUCERS: ActionReducerMap<State> = {
  routerReducer: fromRouterStore.routerReducer
};

export const getNgRxRouterState = createFeatureSelector<State>('router');