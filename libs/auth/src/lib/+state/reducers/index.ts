import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromAuth from './auth.reducer';

export interface AuthState {
  readonly user: fromAuth.LoginState;
}

export const REDUCERS: ActionReducerMap<AuthState> = {
  user: fromAuth.reducer
};

export const getAuthState = createFeatureSelector<AuthState>('auth');
