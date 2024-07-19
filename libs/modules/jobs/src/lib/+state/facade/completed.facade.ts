import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { completedQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { CompletedActions } from '../actions';

// Models
import { IReservations, ICalendar } from '../../models';

@Injectable()
export class CompletedFacade {
  completedReservations$ = this.store.select(completedQuery.getAllCompleted);

  completedReservation$ = this.store.select(
    completedQuery.getSelectedMobileServiceScheduledReservation
  );

  total$ = this.store.select(completedQuery.getCompletedTotals);

  filters$ = this.store.select(completedQuery.getMobileServiceScheduledFilters);

  statuses$ = this.store.select(
    completedQuery.getMobileServiceScheduledStatuses
  );

  loading$ = this.store.select(completedQuery.getCompletedLoading);

  loaded$ = this.store.select(completedQuery.getCompletedLoaded);

  error$ = this.store.select(completedQuery.getCompletedError);

  dayList$ = this.store.select(completedQuery.getCompletedDayList);

  reports$ = this.store.select(completedQuery.getAllReports);

  calendar$ = this.store.select(completedQuery.getCalendarAll);

  router$ = this.store.select(fromRoot.getRouterState);

  constructor(private store: Store<IReservationsState>) {}

  setCompletedPage(config: IReservations.IConfig) {
    this.store.dispatch(CompletedActions.SetCompletedPage({ payload: config }));
  }

  setMobileServiceScheduledFilter(config: IReservations.IFilter) {
    this.store.dispatch(
      CompletedActions.SetMobileServiceScheduledFilter({
        payload: config,
      })
    );
  }

  assignOperationTeam(
    reservation: IReservations.IDocument,
    assign: IReservations.IAssign
  ) {
    this.store.dispatch(
      CompletedActions.AssignOperationTeam({ payload: { reservation, assign } })
    );
  }

  onCancel(reservation: IReservations.IDocument) {
    this.store.dispatch(
      CompletedActions.CancelReservation({ payload: reservation })
    );
  }

  onComplete(reservation: IReservations.IDocument) {
    this.store.dispatch(
      CompletedActions.CompleteReservation({ payload: reservation })
    );
  }

  onReset(reservation: IReservations.IDocument) {
    this.store.dispatch(
      CompletedActions.ResetReservation({ payload: reservation })
    );
  }

  onResetSelectedCompletedReservation() {
    this.store.dispatch(CompletedActions.ResetSelectedCompletedReservation());
  }

  onIncrement() {
    this.store.dispatch(CompletedActions.IncrementDate());
  }

  onDecrement() {
    this.store.dispatch(CompletedActions.DecrementDate());
  }

  onChagedate(payload: string) {
    this.store.dispatch(CompletedActions.ChangeDate({ payload }));
  }

  onResetDate() {
    this.store.dispatch(CompletedActions.ResetDate());
  }

  branchChange() {
    this.store.dispatch(CompletedActions.GoToScheduledList());
  }

  serviceReport() {
    this.store.dispatch(CompletedActions.GetReservationServiceReport());
  }

  jobReport() {
    this.store.dispatch(CompletedActions.GetReservationJobReport());
  }

  amendedReportReport() {
    this.store.dispatch(CompletedActions.GetReservationAmendedReport());
  }

  getCalendar(payload: ICalendar.IGetCalendar) {
    this.store.dispatch(CompletedActions.GetCalendarList({ payload }));
  }

  rescheduleMobileReservation(payload: IReservations.IReschedule) {
    this.store.dispatch(
      CompletedActions.RescheduleMobileReservation({ payload })
    );
  }

  resetMobileServiceCalendar() {
    this.store.dispatch(CompletedActions.ResetMobileServiceCalendar());
  }

  getCompletedReservation(uuid: string) {
    this.store.dispatch(
      CompletedActions.GetCompletedReservation({ payload: uuid })
    );
  }
}
