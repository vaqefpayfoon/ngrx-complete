import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { InProgressActions } from '../actions';

// Services
import { ReservationsService } from '../../services';

// Models
import { IReservations } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom, delay } from 'rxjs/operators';

// Facades
import { InProgressFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class InProgressEffects {
  constructor(
    private actions$: Actions<InProgressActions.InProgressActionsUnion>,
    private reservationsService: ReservationsService,
    private authFacade: AuthFacade,
    private inProgressFacade: InProgressFacade,
    private snackBar: MatSnackBar
  ) {}
  

  loadInProgressJobList$ = createEffect(() =>
  this.actions$.pipe(
    ofType(InProgressActions.LoadInProgressJobList.type),
    switchMap(() => {
      return this.reservationsService.getInProgressList().pipe(
        map((inprogressjob: IReservations.IInProgressJobList) =>
          InProgressActions.LoadInProgressJobListSuccess({
            payload: inprogressjob
          })
        ),
        catchError((res: any) => {
          const message =
            res.status !== 401 ? res.error?.response?.message : null;
          return of(
            InProgressActions.LoadInProgressJobListFail({
              payload: {
                status: res.status,
                message
              }
            })
          );
        })
      );
    })
  )
);

getInProgressJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.GetInProgressJob.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.getInProgressFilter(payload).pipe(
          map((data: IReservations.IInProgressJob) => {
              return InProgressActions.GetInProgressJobSuccess({
                payload: data,
              })
          }
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              InProgressActions.GetInProgressJobFail({
                payload: {
                  status: res.status,
                  message,
                },
              })
            );
          })
        );
      })
    )
  );

  loadInProgressJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.LoadInProgressJob.type),
      switchMap(() => {
        return this.reservationsService.getInProgress().pipe(
          map((inprogressjob: IReservations.IInProgressJob) =>
            InProgressActions.LoadInProgressJobSuccess({
              payload: inprogressjob
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              InProgressActions.LoadInProgressJobFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  loadInProgressJobSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.LoadInProgressJobSuccess.type),
      map(() => InProgressActions.LoadInProgressJobRealTime())
    )
  );

  loadInProgressJobRealTime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.LoadInProgressJobRealTime.type),
      withLatestFrom(this.inProgressFacade.inProgressJob$),
      switchMap(([_, params]) => {
        return this.reservationsService
          .getInProgressJobsFireBase(params.job.uuid)
          .pipe(
            map((inprogressjob: IReservations.IInProgressJob) =>
              InProgressActions.LoadInProgressJobRealTimeSuccess({
                payload: inprogressjob
              })
            ),
            // catchError(() => {
            //   return of(
            //     InProgressActions.LoadInProgressJobRealTimeFail({
            //       payload: {
            //         status: 404,
            //         message:
            //           'Ops. InProgress job not found. Please report the issue'
            //       }
            //     })
            //   );
            // })
          );
      })
    )
  );

  handleLoadInProgressJobRealTimeFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.LoadInProgressJobRealTimeFail.type),
        map(action => {
          const error = action.payload;
          this.toggleSnackbar(error.message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  uploadRepairOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.UploadRepairOrder.type),
      map(action => action.payload),
      switchMap((ro) => {
        return this.reservationsService
          .uploadInProgressRepairOrder(ro)
          .pipe(
            map((inprogressjob: IReservations.IInProgressJob) =>
              InProgressActions.UploadRepairOrderSuccess({
                payload: inprogressjob
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res?.error?.response?.message : null;
              return of(
                InProgressActions.UploadRepairOrderFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleUploadRepairOrderSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.UploadRepairOrderSuccess.type),
        map(action => {
          this.toggleSnackbar('Repair order has been uploaded');
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleUploadRepairOrderFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.UploadRepairOrderFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  uploadProgressInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.UploadProgressInvoice.type),
      map(action => action.payload),
      switchMap((invoice) => {
        delay(500);
        return this.reservationsService
          .uploadInProgressInvoice(invoice)
          .pipe(
            map((inprogressjob: IReservations.IInProgressJob) =>
            {
              return InProgressActions.UploadProgressInvoiceSuccess({
                payload: inprogressjob
              })
            } 
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res?.error?.response?.message : null;
              return of(
                InProgressActions.UploadProgressInvoiceFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleUploadProgressInvoiceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.UploadProgressInvoiceSuccess.type),
        map(action => {
          this.toggleSnackbar('Invoice has been uploaded');
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleUploadProgressInvoiceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.UploadProgressInvoiceFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  getReservationServiceReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.GetOperationDailyReport.type),
      map(action => action.payload),
      switchMap((date: string) => {
        return this.reservationsService.operationDailyReport(date).pipe(
          map((payload: IReservations.IDailyReport) =>
            InProgressActions.GetOperationDailyReportSuccess({
              payload
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              InProgressActions.GetOperationDailyReportFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleGetOperationDailyReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.GetOperationDailyReportFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  completeReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InProgressActions.CompleteReservationByOpertaion.type),
      map(action => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService.reservationCompleteStatus(reservation.uuid, 'JOB_COMPLETED', reservation.reservation).pipe(
          map(() =>
            InProgressActions.CompleteReservationByOpertaionSuccess({
              payload: reservation
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              InProgressActions.CompleteReservationByOpertaionFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleCompleteReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.CompleteReservationByOpertaionSuccess.type),
        map(action => {
          const { referenceNumber } = action.payload;
          this.toggleSnackbar(`${referenceNumber} has been completed.`);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleCompleteReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InProgressActions.CompleteReservationByOpertaionFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
