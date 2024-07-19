import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromServiceLine from './service-line.reducer';
import * as fromServicePackage from './service-package.reducer';

export interface IServiceMenuState {
  readonly serviceLines: fromServiceLine.IServiceLineState;
  readonly servicePackages: fromServicePackage.IServicePackageState;
}

export const REDUCERS: ActionReducerMap<IServiceMenuState> = {
    serviceLines: fromServiceLine.reducer,
    servicePackages: fromServicePackage.reducer
};

export const getServiceMenuModuleState = createFeatureSelector<IServiceMenuState>('serviceMenu');
