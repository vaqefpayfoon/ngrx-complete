import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { serviceCenterScheduledQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { ServiceCenterScheduledActions } from '../actions';

// Models
import { IReservations, ICalendar } from '../../models';

@Injectable()
export class ServiceCenterScheduledFacade {
  completedReservations$ = this.store.select(
    serviceCenterScheduledQuery.getAllServiceCenterScheduled
  );

  total$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledTotal
  );

  totals$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledTotals
  );

  filters$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledFilters
  );

  statuses$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledStatuses
  );

  completedReservation$ = this.store.select(
    serviceCenterScheduledQuery.getSelectedServiceCenterScheduled
  );

  loading$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledLoading
  );

  loaded$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledLoaded
  );

  error$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledError
  );

  dayList$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterScheduledDayList
  );

  reports$ = this.store.select(
    serviceCenterScheduledQuery.getAllServicecenterScheduledReports
  );

  calendar$ = this.store.select(
    serviceCenterScheduledQuery.getServiceCenterCalendarAll
  );

  router$ = this.store.select(fromRoot.getRouterState);

  serviceCenterSlots$ = this.store.select(serviceCenterScheduledQuery.getServiceCenterSlots);

  constructor(private store: Store<IReservationsState>) {}

  setCompletedPage(config: IReservations.IConfig) {
    this.store.dispatch(
      ServiceCenterScheduledActions.SetServiceCenterScheduledPage({
        payload: config,
      })
    );
  }

  setServiceCenterScheduledFilter(config: IReservations.IFilter) {
    this.store.dispatch(
      ServiceCenterScheduledActions.SetServiceCenterScheduledFilter({
        payload: config,
      })
    );
  }

  onCancel(reservation: IReservations.IDocument) {
    this.store.dispatch(
      ServiceCenterScheduledActions.CancelServiceCenterScheduled({
        payload: reservation,
      })
    );
  }

  onComplete(reservation: IReservations.IDocument) {
    this.store.dispatch(
      ServiceCenterScheduledActions.CompleteServiceCenterScheduled({
        payload: reservation,
      })
    );
  }

  onReset(reservation: IReservations.IDocument) {
    this.store.dispatch(
      ServiceCenterScheduledActions.ResetServiceCenterReservation({
        payload: reservation,
      })
    );
  }

  assignOperationTeam(
    reservation: IReservations.IDocument,
    assign: IReservations.IAssign
  ) {
    this.store.dispatch(
      ServiceCenterScheduledActions.ServiceCenterAssignOperationTeam({
        payload: { reservation, assign },
      })
    );
  }

  onIncrement() {
    this.store.dispatch(ServiceCenterScheduledActions.IncrementDate());
  }

  onDecrement() {
    this.store.dispatch(ServiceCenterScheduledActions.DecrementDate());
  }

  onChagedate(payload: string) {
    this.store.dispatch(ServiceCenterScheduledActions.ChangeDate({ payload }));
  }

  onResetDate() {
    this.store.dispatch(ServiceCenterScheduledActions.ResetDate());
  }

  onResetSelectedServiceCenterScheduled() {
    this.store.dispatch(
      ServiceCenterScheduledActions.ResetSelectedServiceCenterScheduled()
    );
  }

  branchChange() {
    this.store.dispatch(
      ServiceCenterScheduledActions.GoToServiceCenterScheduledList()
    );
  }

  serviceReport() {
    this.store.dispatch(
      ServiceCenterScheduledActions.GetServiceCenterScheduledReport()
    );
  }

  jobReport() {
    this.store.dispatch(
      ServiceCenterScheduledActions.GetServiceCenterScheduledJobReport()
    );
  }

  amendedReportReport() {
    this.store.dispatch(
      ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReport()
    );
  }

  getCalendar(payload: ICalendar.IGetCalendar) {
    this.store.dispatch(
      ServiceCenterScheduledActions.GetServiceCenterCalendarList({ payload })
    );
  }

  rescheduleServiceCenterReservation(payload: IReservations.IReschedule) {
    this.store.dispatch(
      ServiceCenterScheduledActions.RescheduleServiceCenterReservation({
        payload,
      })
    );
  }

  resetServiceCenterCalendar() {
    this.store.dispatch(
      ServiceCenterScheduledActions.ResetServiceCenterCalendar()
    );
  }

  getServiceCenterScheduled(uuid: string) {
    this.store.dispatch(
      ServiceCenterScheduledActions.GetServiceCenterScheduled({ payload: uuid })
    );
  }

  getReservationSlots() {
    this.store.dispatch(
      ServiceCenterScheduledActions.GetServiceCenterSlots()
    )
  }
}
