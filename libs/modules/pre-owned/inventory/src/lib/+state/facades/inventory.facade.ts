import { Injectable, Injector } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { InventoryState } from '../reducers';

// Selector
import { InventoryQuory } from '../selectors';

// Action
import { InventoryActions } from '../actions';

//Models
import { IModels } from '@neural/modules/models';

//rxjs
import { Observable } from 'rxjs';

//Auth facade
import { AuthFacade } from '@neural/auth';

@Injectable()
export class InventoryFacade {
  constructor(
    private store: Store<InventoryState>,
    private injector: Injector,
    private authFacade: AuthFacade
  ) {}

  loading$ = this.store.select(InventoryQuory.getInventoryLoading);

  loaded$ = this.store.select(InventoryQuory.getInventoryLoaded);

  error$ = this.store.select(InventoryQuory.getInventoryError);

  inventories$ = this.store.select(InventoryQuory.getAllInventories);

  total$ = this.store.select(InventoryQuory.getInventoryTotal);

  getInventoryImports(uuid: string) {
    this.store.dispatch(InventoryActions.getPreOwnedImports({ payload: uuid }));
  }
}
