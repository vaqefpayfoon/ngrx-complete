import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { corporatesQuery, reservtionsQuery } from '../selectors';

// Action
import { ReservationsActions } from '../actions';

// Models
import { IReservations } from '../../models';

@Injectable()
export class ReservationsFacade {
  reservations$ = this.store.select(reservtionsQuery.getAllReservations);

  total$ = this.store.select(reservtionsQuery.getReservationsTotal);

  corporate$ = this.store.select(corporatesQuery.getSelectedCorporate);
  
  reservationsConfig$ = this.store.select(reservtionsQuery.getReservationsPage);

  reservation$ = this.store.select(reservtionsQuery.getSelectedReservation);

  loading$ = this.store.select(reservtionsQuery.getReservationsLoading);

  loaded$ = this.store.select(reservtionsQuery.getReservationsLoaded);

  error$ = this.store.select(reservtionsQuery.getReservationsError);

  constructor(private store: Store<IReservationsState>) {}

  setResevationPage(config: IReservations.IConfig) {
    this.store.dispatch(
      ReservationsActions.SetReservationPage({ payload: config })
    );
  }

  branchChange() {
    this.store.dispatch(ReservationsActions.GoToDeclinedList());
  }

  onResetSelectedReservation() {
    this.store.dispatch(ReservationsActions.ResetSelectedReservation());
  }

  getReservation(uuid: string) {
    this.store.dispatch(ReservationsActions.GetReservation({ payload: uuid }));
  }

  getCorporate(uuid: string) {
   this.store.dispatch(ReservationsActions.LoadCorporate({ payload: uuid }));
  }
}
