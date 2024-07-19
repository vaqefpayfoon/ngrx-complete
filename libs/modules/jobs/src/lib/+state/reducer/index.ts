import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromInProgress from './in-progress.reducer';
import * as fromReservations from './reservations.reducer';
import * as fromServiceCenterDeclined from './service-center-declined.reducer';
import * as fromServiceCenterScheduled from './service-center-scheduled.reducer';
import * as fromBranchTeams from './branch-team.reducer';
import * as fromCompleted from './completed.reducer';
import * as fromWarranties from './warranties.reducer';
import * as fromManualReservation from './manual-reservation.reducer';
import * as fromCorporates from './corporates.reducer';
import * as fromServiceLines from './service-line.reducer';

export interface IReservationsState {
  readonly inProgress: fromInProgress.InProgressState;
  readonly reservations: fromReservations.ReservationsState;
  readonly serviceCenterDeclined: fromServiceCenterDeclined.ServiceCenterDeclinedState;
  readonly serviceCenterScheduled: fromServiceCenterScheduled.ServiceCenterScheduledState;
  readonly branchTeams: fromBranchTeams.BranchTeamState;
  readonly completed: fromCompleted.CompletedState;
  readonly warranties: fromWarranties.WarrantiesState;
  readonly manualReservation: fromManualReservation.ManualReservationState;
  readonly corporates: fromCorporates.CorporateState;
  readonly serviceLines: fromServiceLines.IServiceLineState;
}

export const REDUCERS: ActionReducerMap<IReservationsState> = {
  inProgress: fromInProgress.reducer,
  reservations: fromReservations.reducer,
  serviceCenterDeclined: fromServiceCenterDeclined.reducer,
  serviceCenterScheduled: fromServiceCenterScheduled.reducer,
  branchTeams: fromBranchTeams.reducer,
  completed: fromCompleted.reducer,
  warranties: fromWarranties.reducer,
  manualReservation: fromManualReservation.reducer,
  corporates: fromCorporates.reducer,
  serviceLines: fromServiceLines.reducer,
};

export const getReservationsState = createFeatureSelector<IReservationsState>(
  'reservations'
);
