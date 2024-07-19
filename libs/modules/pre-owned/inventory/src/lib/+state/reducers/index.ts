import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromInventory from './inventory.reducer';

export interface InventoryState {
  readonly inventories: fromInventory.InventoryState;
}

export const REDUCERS: ActionReducerMap<InventoryState> = {
  inventories: fromInventory.reducer,
};

export const getinventoriesModuleState = createFeatureSelector<InventoryState>('inventories');
