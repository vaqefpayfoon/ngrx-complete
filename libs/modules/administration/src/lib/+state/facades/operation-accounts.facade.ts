import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { operationAccountQuery, groupsQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { OperationAccountsActions } from '../actions';

// Model
import { IAccount } from '../../models';

@Injectable()
export class OperationAccountsFacade {
  loading$ = this.store.select(
    operationAccountQuery.getOperationAccountsLoading
  );

  error$ = this.store.select(operationAccountQuery.getOperationAccountsError);

  accounts$ = this.store.select(operationAccountQuery.getAllOperationAccounts);

  account$ = this.store.select(
    operationAccountQuery.getOperationSelectedAccount
  );

  accountsConfig$ = this.store.select(
    operationAccountQuery.getOperationAccountsPage
  );

  total$ = this.store.select(operationAccountQuery.getOperationAccountsTotal);

  groups$ = this.store.select(groupsQuery.getAllGroups);

  router$ = this.store.select(fromRoot.getRouterState);

  loaded$ = this.store.select(operationAccountQuery.getOperationAccountsLoaded);

  constructor(private store: Store<IAdminState>) {}

  toggleStatus(account: IAccount.IDocument) {
    if (account.active) {
      this.store.dispatch(
        OperationAccountsActions.DeactivateOperationAccount({ payload: account })
      );
    } else {
      this.store.dispatch(
        OperationAccountsActions.ActivateOperationAccount({ payload: account })
      );
    }
  }

  deleteAccount(account: IAccount.IDocument) {
    this.store.dispatch(
      OperationAccountsActions.DeleteOperationAccount({ payload: account })
    );
  }

  resetToggle(account: IAccount.IDocument) {
    this.store.dispatch(
      OperationAccountsActions.ResetOperationAccountStatus({
        payload: {
          id: account.uuid,
          changes: {
            active: account.active,
          },
        },
      })
    );
  }

  changeAccountsPage(config: IAccount.IConfig) {
    this.store.dispatch(
      OperationAccountsActions.SetOperationAccountsPage({ payload: config })
    );
  }

  resetAccountPage() {
    const params: IAccount.IConfig = {
      page: 1,
      limit: IAccount.Config.LIMIT,
    };
    this.store.dispatch(
      OperationAccountsActions.SetOperationAccountsPage({ payload: params })
    );
  }

  resetFilterAccount() {
    this.store.dispatch(
      OperationAccountsActions.ResetFilterOperationAccounts()
    );
  }

  resetSortAccount() {
    this.store.dispatch(OperationAccountsActions.ResetSortOperationAccounts());
  }

  onResetSelectedOperationAccount() {
    this.store.dispatch(
      OperationAccountsActions.ResetSelectedOperationAccount()
    );
  }

  onSearch(email: IAccount.IFilter) {
    if (email) {
      this.store.dispatch(
        OperationAccountsActions.FilterOperationAccounts({ payload: email })
      );
    }
  }

  onSort(sort: IAccount.ISort) {
    if (sort) {
      this.store.dispatch(
        OperationAccountsActions.SortOperationAccounts({ payload: sort })
      );
    }
  }

  onCreate(account: IAccount.ICreate) {
    this.store.dispatch(
      OperationAccountsActions.CreateOperationAccount({ payload: account })
    );
  }

  onUpdate(account: IAccount.IDocument) {
    this.store.dispatch(
      OperationAccountsActions.UpdateOperationAccount({ payload: account })
    );
  }

  onUpdatePassword(account: IAccount.IUpdatePass) {
    this.store.dispatch(
      OperationAccountsActions.UpdateOperationPassword({ payload: account })
    );
  }

  onRedirect() {
    this.store.dispatch(OperationAccountsActions.RedirectToOperationAccounts());
  }

  resyncAccount(account: IAccount.IDocument) {
    this.store.dispatch(
      OperationAccountsActions.ResyncOperationAccount({ payload: account })
    );
  }

  getOperationAccount(uuid: string) {
    this.store.dispatch(
      OperationAccountsActions.GetOperationAccount({ payload: uuid })
    );
  }
}
