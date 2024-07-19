import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';
import { CorporatesActions } from '../actions';

// Reducers
import { ILeadState } from '../reducers';

// Selector
import { corporatesQuery } from '../selectors';


@Injectable()
export class CorporatesFacade {

  corporate$ = this.store.select(corporatesQuery.getSelectedCorporate);

  loading$ = this.store.select(corporatesQuery.getCorporatesLoading);

  error$ = this.store.select(corporatesQuery.getCorporatesError);

  constructor(
    private store: Store<ILeadState>,
  ) {}
  getCorporate(uuid: string) {
    this.store.dispatch(CorporatesActions.LoadCorporate({ payload: uuid }));
  }
}
