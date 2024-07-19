import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromInventory from '../reducers/inventory.reducer';

import * as fromRoot from '@neural/ngrx-router';

import { IInventory } from '../../models';

export const getInventoryState = createSelector(
  fromFeature.getinventoriesModuleState,
  (state: fromFeature.InventoryState) => state.inventories
);

export const getInventoryEntities = createSelector(
  getInventoryState,
  fromInventory.selectInventoryEntities
);

export const getAllInventories = createSelector(
  getInventoryState,
  fromInventory.selectAllInventories
);

export const getInventoryTotals = createSelector(
  getInventoryState,
  fromInventory.selectInventoriesTotal
);

export const getInventoryTotal = createSelector(
  getInventoryState,
  (state: fromInventory.InventoryState) => state.total
);

export const getInventoryLoaded = createSelector(
  getInventoryState,
  (state: fromInventory.InventoryState) => state.loaded
);

export const getInventoryLoading = createSelector(
  getInventoryState,
  (state: fromInventory.InventoryState) => state.loading
);

export const getInventoryError = createSelector(
  getInventoryState,
  (state: fromInventory.InventoryState) => state.error
);

export const InventoryQuory = {
  getAllInventories,
  getInventoryEntities,
  getInventoryError,
  getInventoryLoaded,
  getInventoryLoading,
  getInventoryTotal,
  getInventoryTotals,
};
