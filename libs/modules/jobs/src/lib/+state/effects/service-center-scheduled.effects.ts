import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ServiceCenterScheduledActions } from '../actions';
import { ManualReservationsActions } from '../actions';

// Services
import { ReservationsService } from '../../services';

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
import { ServiceCenterScheduledFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class ServiceCenterScheduledEffects {
  constructor(
    private actions$: Actions<
      | ServiceCenterScheduledActions.ServiceCenterScheduledsActionsUnion
      | ManualReservationsActions.ManualReservationsActionsUnion
    >,
    private reservationsService: ReservationsService,
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setServiceCenterScheduledPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.SetServiceCenterScheduledPage.type),
      map(() => ServiceCenterScheduledActions.LoadServiceCenterScheduled())
    )
  );

  setServiceCenterScheduledFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.SetServiceCenterScheduledFilter.type
      ),
      map(() => ServiceCenterScheduledActions.LoadServiceCenterScheduled())
    )
  );

  changeDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.ChangeDate.type),
      map(() => ServiceCenterScheduledActions.LoadServiceCenterScheduled())
    )
  );

  loadServiceCenterScheduled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.LoadServiceCenterScheduled.type),
      withLatestFrom(
        this.serviceCenterScheduledFacade.filters$,
        this.serviceCenterScheduledFacade.statuses$,
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
          .getMixedReservations(filters, statuses)
          .pipe(
            map((data) =>
              ServiceCenterScheduledActions.LoadServiceCenterScheduledSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res?.error?.response?.message : null;
              return of(
                ServiceCenterScheduledActions.LoadServiceCenterScheduledFail({
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

  getServiceCenterScheduled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.GetServiceCenterScheduled.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.getReservation(payload).pipe(
          map((data: IReservations.IDocument) =>
            ServiceCenterScheduledActions.GetServiceCenterScheduledSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceCenterScheduledActions.GetServiceCenterScheduledFail({
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

  handleGetServiceCenterScheduledFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.GetServiceCenterScheduledFail.type),
      map((action) => {
        const { message } = action.payload;
        return this.toggleSnackbar(message);
      }),
      map(() => ServiceCenterScheduledActions.GoToServiceCenterScheduledList())
    )
  );

  getServiceCenterScheduledReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.GetServiceCenterScheduledReport.type
      ),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.serviceCenterScheduledFacade.filters$
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
              ServiceCenterScheduledActions.GetServiceCenterScheduledReportSuccess(
                {
                  payload,
                }
              )
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ServiceCenterScheduledActions.GetServiceCenterScheduledReportFail(
                  {
                    payload: message,
                  }
                )
              );
            })
          );
      })
    )
  );

  handleGetServiceCenterScheduledReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.GetServiceCenterScheduledReportFail.type
        ),
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

  getServiceCenterScheduledAmendedReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReport
          .type
      ),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.serviceCenterScheduledFacade.filters$
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
              ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReportSuccess(
                {
                  payload,
                }
              )
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ServiceCenterScheduledActions.GetServiceCenterScheduledAmendedReportFail(
                  {
                    payload: message,
                  }
                )
              );
            })
          );
      })
    )
  );

  handleGetServiceCenterScheduledAmendedReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions
            .GetServiceCenterScheduledAmendedReportFail.type
        ),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  getServiceCenterScheduledJobReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.GetServiceCenterScheduledJobReport.type
      ),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.serviceCenterScheduledFacade.filters$
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
              ServiceCenterScheduledActions.GetServiceCenterScheduledJobReportSuccess(
                {
                  payload,
                }
              )
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ServiceCenterScheduledActions.GetServiceCenterScheduledJobReportFail(
                  {
                    payload: message,
                  }
                )
              );
            })
          );
      })
    )
  );

  handleGetServiceCenterScheduledJobReportFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.GetServiceCenterScheduledJobReportFail
            .type
        ),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  cancelServiceCenterScheduledFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.CancelServiceCenterScheduled.type),
      map((action) => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService
          .cancelReservationServiceCenter(reservation)
          .pipe(
            map(() =>
              ServiceCenterScheduledActions.CancelServiceCenterScheduledSuccess(
                {
                  payload: reservation,
                }
              )
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ServiceCenterScheduledActions.CancelServiceCenterScheduledFail({
                  payload: message,
                })
              );
            })
          );
      })
    )
  );

  handleCancelServiceCenterScheduledFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.CancelServiceCenterScheduledFail.type
        ),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  compleServiceCenterScheduledteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.CompleteServiceCenterScheduled.type),
      map((action) => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService.completeReservation(reservation).pipe(
          map(() =>
            ServiceCenterScheduledActions.CompleteServiceCenterScheduledSuccess(
              {
                payload: {
                  id: reservation.uuid,
                  changes: {
                    status: IReservations.Status.JOB_COMPLETED,
                    referenceNumber: reservation.referenceNumber,
                  },
                },
              }
            )
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceCenterScheduledActions.CompleteServiceCenterScheduledFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleCompleteServiceCenterScheduledFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.CompleteServiceCenterScheduledFail.type
        ),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCancelServiceCenterScheduledSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.CancelServiceCenterScheduledSuccess.type
        ),
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

  handleCompleteServiceCenterScheduledSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.CompleteServiceCenterScheduledSuccess
            .type
        ),
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

  handleGoToServiceCenterScheduledList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.GoToServiceCenterScheduledList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/service-center/scheduled'],
          },
        });
      })
    )
  );

  getServiceCenterCalendarList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.GetServiceCenterCalendarList.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.listCalendar({ ...payload }).pipe(
          map((data) =>
            ServiceCenterScheduledActions.GetServiceCenterCalendarListSuccess({
              payload: data,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceCenterScheduledActions.GetServiceCenterCalendarListFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  rescheduleServiceCenterReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.RescheduleServiceCenterReservation.type
      ),
      map((action) => action.payload),
      switchMap((payload) =>
        this.reservationsService
          .rescheduleServiceCenterReservation(payload)
          .pipe(
            map((data) =>
              ServiceCenterScheduledActions.RescheduleServiceCenterReservationSuccess(
                {
                  payload: {
                    id: data.uuid,
                    changes: data,
                  },
                }
              )
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ServiceCenterScheduledActions.RescheduleServiceCenterReservationFail(
                  {
                    payload: message,
                  }
                )
              );
            })
          )
      )
    )
  );

  handleRescheduleServiceCenterReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.RescheduleServiceCenterReservationSuccess
          .type
      ),
      map((action) => {
        const { referenceNumber } = action.payload.changes;
        this.toggleSnackbar(`${referenceNumber} has been rescheduled.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/service-center/scheduled'],
          },
        });
      })
    )
  );

  handleRescheduleMobileReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.RescheduleServiceCenterReservationFail
            .type
        ),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  serviceCenterAssignOperationTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.ServiceCenterAssignOperationTeam.type
      ),
      map((action) => action.payload),
      switchMap((payload) => {
        const { reservation, assign } = payload;
        return this.reservationsService
          .assignOperationTeam(reservation, assign)
          .pipe(
            map(() =>
              ServiceCenterScheduledActions.ServiceCenterAssignOperationTeamSuccess(
                {
                  payload: {
                    id: reservation.uuid,
                    changes: reservation,
                  },
                }
              )
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res?.error?.response?.message : null;
              return of(
                ServiceCenterScheduledActions.ServiceCenterAssignOperationTeamFail(
                  { payload: message }
                )
              );
            })
          );
      })
    )
  );

  handleServiceCenterAssignOperationTeamSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ServiceCenterScheduledActions.ServiceCenterAssignOperationTeamSuccess
          .type
      ),
      map((action) => {
        const { referenceNumber } = action.payload.changes;

        this.toggleSnackbar(`${referenceNumber} has been assigned.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/service-center/scheduled'],
          },
        });
      })
    )
  );

  handleServiceCenterAssignOperationTeamFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.ServiceCenterAssignOperationTeamFail
            .type
        ),
        map((action) => {
          const message = action.payload;
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
      ofType(ServiceCenterScheduledActions.ResetServiceCenterReservation.type),
      map((action) => action.payload),
      switchMap((reservation: IReservations.IDocument) => {
        return this.reservationsService.resetReservation(reservation).pipe(
          map(() => {
            return ServiceCenterScheduledActions.ResetServiceCenterReservationSuccess(
              {
                payload: {
                  id: reservation.uuid,
                  changes: {
                    operation: null,
                    status: IReservations.Status.JOB_PENDING,
                    referenceNumber: reservation.referenceNumber,
                  },
                },
              }
            );
          }),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceCenterScheduledActions.ResetServiceCenterReservationFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleResetServiceCenterReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.ResetServiceCenterReservationSuccess
            .type
        ),
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

  handleResetServiceCenterReservation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ServiceCenterScheduledActions.ResetServiceCenterReservationFail.type
        ),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleDeleteMobileReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ManualReservationsActions.DeleteManualServiceReservationSuccess.type
      ),
      map((action) => action.payload),
      map((payload) =>
        ServiceCenterScheduledActions.DeleteServiceCenterScheduledSuccess({
          payload,
        })
      )
    )
  );

  loadServiceCenterSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterScheduledActions.GetServiceCenterSlots.type),
      withLatestFrom(
        this.serviceCenterScheduledFacade.dayList$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, date, branch]) => {
        const { uuid } = branch;
        const filters: IReservations.IFilter = {
          branchUuid: uuid,
          year: date.year,
          month: date.month,
          ['selectedTypes[]']: 'Service'
        };

        return this.reservationsService
          .getReservationSlots(filters)
          .pipe(
            map((data) =>
              ServiceCenterScheduledActions.GetServiceCenterSlotsSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res?.error?.response?.message : null;
              return of(
                ServiceCenterScheduledActions.GetServiceCenterSlotsFail({
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

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
