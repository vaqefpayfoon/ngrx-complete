import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { State, getNgRxRouterState } from '../reducers';

export const getRouterState = createSelector(
  getNgRxRouterState,
  (state: State) => state.routerReducer
);



export const ROUTER_FEATURE_KEY = 'router';

export const selectRouter =
    createFeatureSelector<fromRouter.RouterReducerState>(ROUTER_FEATURE_KEY);

export const {
    selectCurrentRoute, // select the current route
    selectFragment, // select the current route fragment
    selectQueryParams, // select the current route query params
    selectQueryParam, // factory function to select a query param
    selectRouteParams, // select the current route params
    selectRouteParam, // factory function to select a route param
    selectRouteData, // select the current route data
    selectUrl, // select the current url
} = fromRouter.getSelectors(selectRouter);