import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISalesState } from '../reducers';

// Selector
import { valuationQuery } from '../selectors';

// Action
import { ValuationsActions } from '../actions';

// Model
import { IPurchases, ISales } from '../../models';

@Injectable()
export class ValuationsFacade {
  loading$ = this.store.select(valuationQuery.getValuationsLoading);

  error$ = this.store.select(valuationQuery.getValuationsError);

  valuations$ = this.store.select(valuationQuery.getAllValuations);

  valuation$ = this.store.select(valuationQuery.getSelectedValuation);

  valuationsConfig$ = this.store.select(valuationQuery.getValuationsPage);

  getValuationsFilters$ = this.store.select(valuationQuery.getValuationsFilters);

  getValuationsSorts$ = this.store.select(valuationQuery.getValuationsSorts);

  total$ = this.store.select(valuationQuery.getValuationsTotal);

  constructor(private store: Store<ISalesState>) {}

  changeValuationsPage(config: ISales.IConfig) {
    this.store.dispatch(
      ValuationsActions.ChangeValuationsPage({ payload: config })
    );
  }

  changeValuationsFilter(filter: ISales.IFilter) {
    this.store.dispatch(
      ValuationsActions.SetValuationsFilters({ payload: filter })
    );
  }

  resetValuationsPage() {
    const params: ISales.IConfig = {
      page: 1,
      limit: ISales.Config.LIMIT,
    };
    this.store.dispatch(ValuationsActions.SetValuationsPage({ payload: params }));
  }

  onComplete(payload: IPurchases.IDocument) {
    this.store.dispatch(ValuationsActions.CompleteValuation({ payload }));
  }

  onCancel(payload: IPurchases.IDocument) {
    this.store.dispatch(ValuationsActions.CancelValuation({ payload }));
  }

  onUpdate(payload: ISales.IDocument) {
    this.store.dispatch(ValuationsActions.UpdateValuation({ payload }));
  }

  onResetSelectedValuation() {
    this.store.dispatch(ValuationsActions.ResetSelectedValuation());
  }
}
