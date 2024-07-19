import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

import { CurrenciesActions } from '../actions';

// Reducers
import { IAdminState } from '../reducers';

// Selector
import { CurrenciesQuery } from '../selectors';

@Injectable()
export class CurrenciesFacade {
  constructor(private store: Store<IAdminState>) {}

  currencies$ = this.store.select(CurrenciesQuery.getAllCurrencies);

  loaded$ = this.store.select(CurrenciesQuery.getCurrenciesLoaded);

  LoadCurrencies() {
    this.store.dispatch(CurrenciesActions.LoadCurrencies());
  }
}
