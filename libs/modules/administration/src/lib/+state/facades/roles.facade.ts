import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { roleQuery } from '../selectors';

// Action
import { RolesActions } from '../actions';

// Models
import { IRole } from '../../models';

@Injectable()
export class RolesFacade {
  role$ = this.store.select(roleQuery.getSelectedRole);
  loading$ = this.store.select(roleQuery.getRolesLoading);
  error$ = this.store.select(roleQuery.getRolesError);
  roles$ = this.store.select(roleQuery.getAllRoles);
  loaded$ = this.store.select(roleQuery.getRolesLoaded);

  constructor(private store: Store<IAdminState>) {}

  onLoad() {
    this.store.dispatch(RolesActions.LoadRoles());
  }

  create(event: IRole.IDocument) {
    this.store.dispatch(RolesActions.CreateRole({ payload: event }));
  }

  update(event: IRole.IDocument) {
    this.store.dispatch(RolesActions.UpdateRole({ payload: event }));
  }

  delete(event: IRole.IDocument) {
    this.store.dispatch(RolesActions.DeleteRole({ payload: event }));
  }

  onResetSelectedRole() {
    this.store.dispatch(RolesActions.ResetSelectedRole());
  }

  onSearch(filter: any) {
    if (filter === false) {
      this.onLoad();
    }
  }

  getRole(uuid: string) {
    this.store.dispatch(RolesActions.GetRole({ payload: uuid }));
  }
}
