import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { inProgressQuery } from '../selectors';

// Action
import { InProgressActions } from '../actions';

// Models
import { IReservations } from '../../models';
import { ReservationsService } from '../../services';
import { delay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class InProgressFacade {
  inProgressJob$ = this.store.select(inProgressQuery.getInProgress);

  inProgressJobList$ = this.store.select(inProgressQuery.getInProgressList);

  loading$ = this.store.select(inProgressQuery.getInProgressLoading);

  loaded$ = this.store.select(inProgressQuery.getInProgressLoaded);

  error$ = this.store.select(inProgressQuery.getInProgressError);

  dailyReportError$ = this.store.select(inProgressQuery.getDailyReportError);

  dailyReport$ = this.store.select(inProgressQuery.getDailyReport);

  constructor(
    private store: Store<IReservationsState>,
    private reservationsService: ReservationsService,
    private snackBar: MatSnackBar
  ) {}

  onLoad() {
    this.store.dispatch(InProgressActions.LoadInProgressJob());
  }
  onLoadList() {
    this.store.dispatch(InProgressActions.LoadInProgressJobList());
  }
  onGetInprogress(referenceNumber: string) {
    this.store.dispatch(
      InProgressActions.GetInProgressJob({ payload: referenceNumber })
    );
  }
  onCreate(ro: IReservations.ICreate) {
    // todo: move it in state

    this.reservationsService
      .reservationStatus(ro.uuid, ro.type, ro.reservation, ro.status)
      .subscribe(
        (res) => {
          if (res) {
            this.store.dispatch(
              InProgressActions.UploadRepairOrder({ payload: ro })
            );
          }
        },
        (err) => {
          if(err?.error?.httpStatus) {
            this.toggleSnackbar(err.error?.response?.message)
          }
        }
      );
  }

  onUpdate(invoice: IReservations.IUpdate) {
    this.store.dispatch(
      InProgressActions.UploadProgressInvoice({ payload: invoice })
    );
  }
  onCompleteStatus(uuid: string, type: string, reservation: boolean) {
    if (!reservation) {
      this.reservationsService
        .reservationStatus(uuid, type, reservation, 'COMPLETED')
        .subscribe((res) => {});
    }
  }
  onComplete(reservation: IReservations.IDocument) {
    this.store.dispatch(
      InProgressActions.CompleteReservationByOpertaion({ payload: reservation })
    );
  }

  onReport(date: string) {
    this.store.dispatch(
      InProgressActions.GetOperationDailyReport({ payload: date })
    );
  }
  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
