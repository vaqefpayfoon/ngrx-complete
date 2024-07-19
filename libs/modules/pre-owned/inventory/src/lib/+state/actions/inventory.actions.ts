//Ngrx
import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

import { IError } from '@neural/shared/data';

//Auth
import { Auth } from '@neural/auth';

//Models
import { IInventory } from '../../models';

export const getPreOwnedImports = createAction(
  '[Hub] Get PreOwned Imports',
  props<{ payload:string }>()
);
export const getPreOwnedImportsFail = createAction(
  '[Hub] Get PreOwned Imports Fail',
  props<{ payload:IError }>()
);
export const getPreOwnedImportsSuccess = createAction(
  '[Hub] Get PreOwned Imports Success',
  props<{ inventories:IInventory.IInventory[]}>()
);

const all = union({
  getPreOwnedImports,
  getPreOwnedImportsFail,
  getPreOwnedImportsSuccess,
});

export type InventoryActionsUnion = typeof all;

