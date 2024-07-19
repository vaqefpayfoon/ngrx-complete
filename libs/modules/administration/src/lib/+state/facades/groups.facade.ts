import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { groupsQuery, roleQuery } from '../selectors';

// Action
import { GroupsActions } from '../actions';

// Models
import { IGroup } from '../../models';

@Injectable()
export class GroupsFacade {
  loading$ = this.store.select(groupsQuery.getGroupsLoading);

  error$ = this.store.select(groupsQuery.getGroupsError);

  groups$ = this.store.select(groupsQuery.getAllGroups);

  group$ = this.store.select(groupsQuery.getSelectedGroup);

  roles$ = this.store.select(roleQuery.getRoleNames);

  loaded$ = this.store.select(groupsQuery.getGroupsLoaded);

  constructor(private store: Store<IAdminState>) {}

  onLoad() {
    this.store.dispatch(GroupsActions.LoadGroups());
  }

  create(event: IGroup.IDocument) {
    this.store.dispatch(GroupsActions.CreateGroup({ payload: event }));
  }

  update(event: IGroup.IDocument) {
    this.store.dispatch(GroupsActions.UpdateGroup({ payload: event }));
  }

  delete(event: IGroup.IDocument) {
    this.store.dispatch(GroupsActions.DeleteGroup({ payload: event }));
  }

  onResetSelectedGroup() {
    this.store.dispatch(GroupsActions.ResetSelectedGroup());
  }

  onSearch(filter: any) {
    if (filter === false) {
      this.onLoad();
    }
  }

  onRedirect() {
    this.store.dispatch(GroupsActions.RedirectToGroups());
  }

  getGroup(uuid: string) {
    this.store.dispatch(GroupsActions.GetGroup({ payload: uuid }));
  }
}
