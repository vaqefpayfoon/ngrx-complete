import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';


// Selector
import { operationAccountQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';
import { ICorporateState } from '../reducers';
import { OperationAccountsActions } from '../actions';
import { IBranches } from '../../models';


@Injectable()
export class OperationAccountsFacade {

  accounts$ = this.store.select(operationAccountQuery.getAllOperationAccounts);


  constructor(private store: Store<ICorporateState>) {}


  getAccounts(type: IBranches.IOperationPayload) {
    this.store.dispatch(OperationAccountsActions.LoadOperationAccounts({ payload: type }));
  }

}
