import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromFleets from './fleet.reducer';

export interface IFleetState {
  readonly fleets: fromFleets.FleetState;
}

export const REDUCERS: ActionReducerMap<IFleetState> = {
  fleets: fromFleets.reducer
};

export const getFleetState = createFeatureSelector<IFleetState>('fleets');
