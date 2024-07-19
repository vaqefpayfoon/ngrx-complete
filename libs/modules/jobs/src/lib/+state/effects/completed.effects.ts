import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CompletedActions } from '../actions';

// Services
import { ReservationsService } from '../../services';
import { ManualReservationsActions } from '../actions';

// Models
import { IReservations } from '../../models';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom,
  tap,
} from 'rxjs/operators';

// Facades
import { CompletedFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class CompletedEffects {
  constructor(
    private actions$: Actions<
      | CompletedActions.CompletedsActionsUnion
      | ManualReservationsActions.ManualReservationsActionsUnion
    >,
    private reservationsService: ReservationsService,
    private completedFacade: CompletedFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setMobileServiceScheduledFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.SetMobileServiceScheduledFilter.type),
      map(() => CompletedActions.LoadCompletedReservation())
    )
  );

  setCompletedPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.SetCompletedPage.type),
      map(() => CompletedActions.LoadCompletedReservation())
    )
  );

  changeDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.ChangeDate.type),
      map(() => CompletedActions.LoadCompletedReservation())
    )
  );

  loadCompletedReservation2$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.LoadCompletedReservation.type),
      withLatestFrom(
        this.completedFacade.filters$,
        this.completedFacade.statuses$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, preFilters, statuses, corporate, branch]) => {
        const { uuid } = branch;

        const filters: IReservations.IFilter = {
          ...preFilters,
          ['corporate.uuid']: corporate.uuid,
          ['branch.uuid']: uuid,
        };

        return this.reservationsService
          .getCompletedReservations(filters, statuses)
          .pipe(
            map((data) =>
              CompletedActions.LoadCompletedReservationSuccess(
                { payload: data }
              )
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CompletedActions.LoadCompletedReservationFail(
                  {
                    payload: {
                      message,
                      status: res.status,
                    },
                  }
                )
              );
            })
          );
      })
    )
  );

  handleDeleteMobileReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.DeleteManualMobileReservationSuccess.type),
        map((action) => action.payload),
        map((payload) =>
          CompletedActions.DeleteMobileReservationSuccess({ payload })
        )
      )
  );

  getCompletedReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GetCompletedReservation.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.getCompletedReservation(payload).pipe(
          map((data: IReservations.IDocument) =>
            CompletedActions.GetCompletedReservationSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CompletedActions.GetCompletedReservationFail({
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

  handleGetCompletedReservationFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GetCompletedReservationFail.type),
      map((action) => {
        const { message } = action.payload;
        return this.toggleSnackbar(message);
      }),
      map(() => CompletedActions.RedirectToCompletedReservations())
    )
  );

  handleRedirectToCompletedReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.RedirectToCompletedReservations.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/mobile/scheduled'],
          },
        });
      })
    )
  );

  getReservationServiceReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GetReservationServiceReport.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.completedFacade.filters$
      ),
      switchMap(([_, corporate, branch, filters]) => {
        return this.reservationsService
          .reservationServiceReport(
            corporate.uuid,
            branch.uuid,
            filters['calendar.slot'] as string,
            filters['serviceType'] as string
          )
          .pipe(
            map((payload: any) =>
              CompletedActions.GetReservationServiceReportSuccess({
                payload,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CompletedActions.GetReservationServiceReportFail({
                  payload: {
                    message,
                    status: res.status,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleGetReservationServiceReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.GetReservationServiceReportFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  getReservationAmendedReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GetReservationAmendedReport.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.completedFacade.filters$
      ),
      switchMap(([_, corporate, branch, filters]) => {
        return this.reservationsService
          .reservationAmendedReport(
            corporate.uuid,
            branch.uuid,
            filters['calendar.slot'] as string,
            filters['serviceType'] as string
          )
          .pipe(
            map((payload: any) =>
              CompletedActions.GetReservationAmendedReportSuccess({
                payload,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CompletedActions.GetReservationAmendedReportFail({
                  payload: {
                    message,
                    status: res.status,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleGetReservationAmendedReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.GetReservationAmendedReportFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  getReservationJobReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GetReservationJobReport.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.completedFacade.filters$
      ),
      switchMap(([_, corporate, branch, filters]) => {

        return this.reservationsService
          .reservationJobReport(
            corporate.uuid,
            branch.uuid,
            filters['calendar.slot'] as string,
            filters['serviceType'] as string
          )
          .pipe(
            map((payload: any) =>
              CompletedActions.GetReservationJobReportSuccess({
                payload,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CompletedActions.GetReservationJobReportFail({
                  payload: {
                    message,
                    status: res.status,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleGetReservationJobReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.GetReservationJobReportFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  cancelReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.CancelReservation.type),
      map((action) => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService
          .cancelReservationMobile(reservation)
          .pipe(
            map(() =>
              CompletedActions.CancelReservationSuccess({
                payload: reservation,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CompletedActions.CancelReservationFail({
                  payload: {
                    message,
                    status: res.status,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleCancelReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.CancelReservationFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  resetReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.ResetReservation.type),
      map((action) => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService.resetReservation(reservation).pipe(
          map(() =>
            CompletedActions.ResetReservationSuccess({
              payload: {
                id: reservation.uuid,
                changes: {
                  status: IReservations.Status.JOB_PENDING,
                  referenceNumber: reservation.referenceNumber,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CompletedActions.ResetReservationFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleResetReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.ResetReservationFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  completeReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.CompleteReservation.type),
      map((action) => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService.completeReservation(reservation).pipe(
          map(() =>
            CompletedActions.CompleteReservationSuccess({
              payload: {
                id: reservation.uuid,
                changes: {
                  status: IReservations.Status.JOB_COMPLETED,
                  referenceNumber: reservation.referenceNumber,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CompletedActions.CompleteReservationFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleCompleteReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.CompleteReservationFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  assignOperationTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.AssignOperationTeam.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { reservation, assign } = payload;
        return this.reservationsService
          .assignOperationTeam(reservation, assign)
          .pipe(
            map(() =>
              CompletedActions.AssignOperationTeamSuccess({
                payload: {
                  id: reservation.uuid,
                  changes: {
                    referenceNumber: reservation.referenceNumber,
                    fleet: reservation.fleet,
                    operation: reservation.operation,
                  },
                },
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CompletedActions.AssignOperationTeamFail({
                  payload: {
                    message,
                    status: res.status,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleAssignOperationTeamFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.AssignOperationTeamFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCancelReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.CancelReservationSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload;
          this.toggleSnackbar(`${referenceNumber} has been canceled.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleResetReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.ResetReservationSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          this.toggleSnackbar(`${referenceNumber} has been reset.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCompleteReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.CompleteReservationSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          this.toggleSnackbar(`${referenceNumber} has been completed.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleAssignOperationTeamSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.AssignOperationTeamSuccess.type),
      map((action) => {
        const { referenceNumber } = action.payload.changes;
        this.toggleSnackbar(`${referenceNumber} has been assigned.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/mobile/scheduled'],
          },
        });
      })
    )
  );

  handleGoToScheduledList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GoToScheduledList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/mobile/scheduled'],
          },
        });
      })
    )
  );

  getCalendarList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.GetCalendarList.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.listCalendar({ ...payload }).pipe(
          map((data) =>
            CompletedActions.GetCalendarListSuccess({ payload: data })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CompletedActions.GetCalendarListFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  rescheduleMobileReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.RescheduleMobileReservation.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.reservationsService.rescheduleMobileReservation(payload).pipe(
          map((data) => {
            return CompletedActions.RescheduleMobileReservationSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            });
          }),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CompletedActions.RescheduleMobileReservationFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        )
      )
    )
  );

  handleRescheduleMobileReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompletedActions.RescheduleMobileReservationSuccess.type),
      map((action) => {
        const { referenceNumber } = action.payload.changes;
        this.toggleSnackbar(`${referenceNumber} has been rescheduled.`);
        return action.payload;
      }),
      withLatestFrom(this.completedFacade.filters$),
      switchMap(([payload, filters]) => {
        const old = new Date(filters['calendar.slot']).getDate();
        const newT = new Date(payload.changes.calendar.slot).getDate();

        if (old === newT) {
          return [
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/app/hub/reservations/mobile/scheduled'],
              },
            }),
          ];
        } else {
          const configDate = new Date(payload.changes.calendar.slot);
          return [
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/app/hub/reservations/mobile/scheduled'],
              },
            }),
            CompletedActions.ChangeDate({
              payload: `${configDate.getFullYear()}-${
                configDate.getMonth() + 1
              }-${configDate.getDate()}`,
            }),
          ];
        }
      })
    )
  );

  handleRescheduleMobileReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CompletedActions.RescheduleMobileReservationFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
