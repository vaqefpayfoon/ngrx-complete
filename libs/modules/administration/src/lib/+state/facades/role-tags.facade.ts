import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

import { RoleTagsActions } from '../actions';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { roleTagsQuery } from '../selectors';

@Injectable()
export class RoleTagsFacade {
  constructor(private store: Store<IAdminState>) {}

  permissions$ = this.store.select(roleTagsQuery.getRoleTagsPermissions);
  loaded$ = this.store.select(roleTagsQuery.getRoleTagsLoaded);

  loadRoleTags() {
    this.store.dispatch(RoleTagsActions.LoadRoleTags());
  }
}
