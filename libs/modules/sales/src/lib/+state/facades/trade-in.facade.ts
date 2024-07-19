import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISalesState } from '../reducers';

// Action
import { TradeInActions } from '../actions';

// Model
import { ITradeIn } from '../../models';
import { IBody, IRequest } from '@neural/shared/data';

@Injectable()
export class TradeInFacade {
  constructor(private store: Store<ISalesState>) {}

  OnCreate(payload: IRequest<ITradeIn.ICreate>) {
    this.store.dispatch(TradeInActions.CreateTradeIn({ payload }));
  }

  onUpdate(payload: IBody<ITradeIn.ITradeInDocumnet, ITradeIn.IUpdate>) {
    this.store.dispatch(TradeInActions.UpdateTradeIn({ payload }));
  }
}
