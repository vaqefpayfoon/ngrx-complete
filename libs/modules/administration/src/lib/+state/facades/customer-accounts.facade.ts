import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { customerAccountQuery, groupsQuery,corporatesQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { CustomerAccountsActions } from '../actions';

// Model
import { IAccount } from '../../models';

@Injectable()
export class CustomerAccountsFacade {
  loading$ = this.store.select(customerAccountQuery.getCustomerAccountsLoading);

  loaded$ = this.store.select(customerAccountQuery.getCustomerAccountsLoaded);

  error$ = this.store.select(customerAccountQuery.getCustomerAccountsError);

  accounts$ = this.store.select(customerAccountQuery.getAllCustomerAccounts);

  account$ = this.store.select(customerAccountQuery.getCustomerSelectedAccount);

  accountsConfig$ = this.store.select(
    customerAccountQuery.getCustomerAccountsPage
  );

  corporate$ = this.store.select(corporatesQuery.getSelectedCorporate);

  total$ = this.store.select(customerAccountQuery.getCustomerAccountsTotal);

  groups$ = this.store.select(groupsQuery.getAllGroups);

  filter$ = this.store.select(customerAccountQuery.getCustomerAccountFilter);

  router$ = this.store.select(fromRoot.getRouterState);

  constructor(private store: Store<IAdminState>) {}

  toggleStatus(account: IAccount.IDocument) {
    if (account.active) {
      this.store.dispatch(
        CustomerAccountsActions.DeactivateCustomerAccount({ payload: account })
      );
    } else {
      this.store.dispatch(
        CustomerAccountsActions.ActivateCustomerAccount({ payload: account })
      );
    }
  }

  deleteAccount(account: IAccount.IDocument) {
    this.store.dispatch(
      CustomerAccountsActions.DeleteCustomerAccount({ payload: account })
    );
  }

  resetToggle(account: IAccount.IDocument) {
    this.store.dispatch(
      CustomerAccountsActions.ResetCustomerAccountStatus({
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
      CustomerAccountsActions.SetCustomerAccountsPage({ payload: config })
    );
  }

  resetAccountPage() {
    const params: IAccount.IConfig = {
      page: 1,
      limit: IAccount.Config.LIMIT,
    };
    this.store.dispatch(
      CustomerAccountsActions.SetCustomerAccountsPage({ payload: params })
    );
  }

  resetFilterAccount() {
    this.store.dispatch(CustomerAccountsActions.ResetFilterCustomerAccounts());
  }

  resetSortAccount() {
    this.store.dispatch(CustomerAccountsActions.ResetSortCustomerAccounts());
  }

  onResetSelectedCustomerAccount() {
    this.store.dispatch(CustomerAccountsActions.ResetSelectedCustomerAccount());
  }

  onSearch(email: IAccount.IFilter) {
    if (email) {
      this.store.dispatch(
        CustomerAccountsActions.FilterCustomerAccounts({ payload: email })
      );
    }
  }

  onFilter(payload: IAccount.IFilter) {
    if (payload) {
      this.store.dispatch(
        CustomerAccountsActions.FilterCustomerAccounts({ payload })
      );
    }
  }

  onSort(sort: IAccount.ISort) {
    if (sort) {
      this.store.dispatch(
        CustomerAccountsActions.SortCustomerAccounts({ payload: sort })
      );
    }
  }

  onCreate(account: IAccount.ICreate) {
    this.store.dispatch(
      CustomerAccountsActions.CreateCustomerAccount({ payload: account })
    );
  }

  onUpdate(account: IAccount.IDocument) {
    this.store.dispatch(
      CustomerAccountsActions.UpdateCustomerAccount({ payload: account })
    );
  }

  onUpdatePassword(account: IAccount.IUpdatePass) {
    this.store.dispatch(
      CustomerAccountsActions.UpdateCustomerPassword({ payload: account })
    );
  }

  onRedirect() {
    this.store.dispatch(CustomerAccountsActions.RedirectToCustomerAccounts());
  }

  resyncAccount(account: IAccount.IDocument) {
    this.store.dispatch(
      CustomerAccountsActions.ResyncCustomerAccount({ payload: account })
    );
  }

  getCustomerAccount(uuid: string) {
    this.store.dispatch(
      CustomerAccountsActions.GetCustomerAccount({ payload: uuid })
    );
  }

  getCorporate(uuid: string) {
    this.store.dispatch(CustomerAccountsActions.LoadCorporate({ payload: uuid }));
   }
}
