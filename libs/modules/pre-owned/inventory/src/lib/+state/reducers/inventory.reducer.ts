//Ngrx
import { createReducer, on } from '@ngrx/store';

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';

//Actions
import { InventoryActions } from '../actions';

//Model
import { IInventory } from '../../models';

export interface InventoryState extends EntityState<IInventory.IInventory> {
  total: number;
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<IInventory.IInventory> = createEntityAdapter<
  IInventory.IInventory
>({
  selectId: (inventory) => inventory.uuid,
});

export const initialState: InventoryState = adapter.getInitialState({
  total: 0,
  loaded: false,
  loading: false,
  error: null,
});

const inventoryReducer = createReducer(
  initialState,
  on(InventoryActions.getPreOwnedImports, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(InventoryActions.getPreOwnedImportsFail, (state, { payload }) => {
    const error = payload;

    return { ...state, loading: false, loaded: false, error };
  }),
  on(InventoryActions.getPreOwnedImportsSuccess, (state, { inventories }) => {
    return adapter.setAll(inventories, {
      ...state,
      loading: false,
      loaded: true,
      error: null,
    });
  })
);

export function reducer(
  state: InventoryState | undefined,
  action: InventoryActions.InventoryActionsUnion
) {
  return inventoryReducer(state, action);
}

const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

// select the dictionary of inventory entities
export const selectInventoryEntities = selectEntities;

// select the array of inventory
export const selectAllInventories = selectAll;

// select the total inventory count
export const selectInventoriesTotal = selectTotal;
