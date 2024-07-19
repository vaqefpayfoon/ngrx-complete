import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { accountQuery, groupsQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { AccountsActions } from '../actions';

// Model
import { IAccount } from '../../models';

@Injectable()
export class AccountsFacade {
  loading$ = this.store.select(accountQuery.getAccountsLoading);

  error$ = this.store.select(accountQuery.getAccountsError);

  accounts$ = this.store.select(accountQuery.getAllAccounts);

  account$ = this.store.select(accountQuery.getSelectedAccount);

  searchedAccount$ = this.store.select(accountQuery.getSearchedAccount);

  accountsConfig$ = this.store.select(accountQuery.getAccountsPage);

  total$ = this.store.select(accountQuery.getAccountsTotal);

  groups$ = this.store.select(groupsQuery.getAllGroups);

  filter$ = this.store.select(accountQuery.getAccountFilter);

  router$ = this.store.select(fromRoot.getRouterState);

  loaded$ = this.store.select(accountQuery.getAccountsLoaded);

  constructor(private store: Store<IAdminState>) {}

  toggleStatus(account: IAccount.IDocument) {
    if (account.active) {
      this.store.dispatch(
        AccountsActions.DeactivateAccount({ payload: account })
      );
    } else {
      this.store.dispatch(
        AccountsActions.ActivateAccount({ payload: account })
      );
    }
  }

  deleteAccount(account: IAccount.IDocument) {
    this.store.dispatch(AccountsActions.DeleteAccount({ payload: account }));
  }

  resetToggle(account: IAccount.IDocument) {
    this.store.dispatch(
      AccountsActions.ResetAccountStatus({
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
    this.store.dispatch(AccountsActions.SetAccountsPage({ payload: config }));
  }

  resetAccountPage() {
    const params: IAccount.IConfig = {
      page: 1,
      limit: IAccount.Config.LIMIT,
    };
    this.store.dispatch(AccountsActions.SetAccountsPage({ payload: params }));
  }

  resetFilterAccount() {
    this.store.dispatch(AccountsActions.ResetFilterAccounts());
  }

  resetSortAccount() {
    this.store.dispatch(AccountsActions.ResetSortAccounts());
  }

  onResetSelectedAccount() {
    this.store.dispatch(AccountsActions.ResetSelectedAccount());
  }

  onSearch(email: IAccount.IFilter) {
    if (email) {
      this.store.dispatch(AccountsActions.FilterAccounts({ payload: email }));
    }
  }

  onSort(sort: IAccount.ISort) {
    if (sort) {
      this.store.dispatch(AccountsActions.SortAccounts({ payload: sort }));
    }
  }

  onCreate(account: IAccount.ICreate) {
    this.store.dispatch(AccountsActions.CreateAccount({ payload: account }));
  }

  onUpdate(account: IAccount.IDocument) {
    this.store.dispatch(AccountsActions.UpdateAccount({ payload: account }));
  }

  onUpdateSearchedAccount(account: IAccount.IDocument) {
    this.store.dispatch(
      AccountsActions.UpdateSearchedAccount({ payload: account })
    );
  }

  onUpdatePassword(account: IAccount.IUpdatePass) {
    this.store.dispatch(AccountsActions.UpdatePassword({ payload: account }));
  }

  onRedirect() {
    this.store.dispatch(AccountsActions.RedirectToAccounts());
  }

  onSearchByEmail(email: string) {
    if (email) {
      this.store.dispatch(AccountsActions.SearchAccount({ payload: email }));
    }
  }

  resetSearch() {
    this.store.dispatch(AccountsActions.ResetSearchedAccount());
  }

  resyncAccount(account: IAccount.IDocument) {
    this.store.dispatch(AccountsActions.ResyncAccount({ payload: account }));
  }

  resyncFirebase(account: IAccount.IDocument) {
    this.store.dispatch(AccountsActions.ResyncFirebase({ payload: account }));
  }

  synchronization(payload: IAccount.ISynchronization) {
    this.store.dispatch(AccountsActions.Synchronization({ payload }));
  }

  getAccount(uuid: string) {
    this.store.dispatch(AccountsActions.GetAccount({ payload: uuid }));
  }
}
