import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICorporateState } from '../reducers';

// Selector
import { brandsQuery } from '../selectors';

// Action
import { BrandsActions } from '../actions';

@Injectable()
export class BrandsFacade {
  
  globalBrands$ = this.store.select(brandsQuery.getGlobalBrands);

  constructor(private store: Store<ICorporateState>) {}

  getBrands() {
    this.store.dispatch(BrandsActions.GetGlobalBrands());
  }
}
