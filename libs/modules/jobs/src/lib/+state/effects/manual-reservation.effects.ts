import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CalendarsActions } from '@neural/modules/calendar';
import { ManualReservationsActions } from '../actions';

// Services
import { ManualReservationsService } from '../../services';

// Models
import { IManualReservations, IReservations } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { CalendarsFacade } from '@neural/modules/calendar';
import { ManualReservationFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Injectable()
export class ManualReservationEffects {
  constructor(
    private actions$: Actions<
      ManualReservationsActions.ManualReservationsActionsUnion
    >,
    private manualReservationsService: ManualReservationsService,
    private manualReservationFacade: ManualReservationFacade,
    private calendarsFacade: CalendarsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setManualReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ManualReservationsActions.SetManualReservations.type,
        ManualReservationsActions.ChangeManualReservations.type
      ),
      map(() => ManualReservationsActions.LoadManualReservations())
    )
  );

  loadManualReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.LoadManualReservations.type),
      withLatestFrom(
        this.manualReservationFacade.manualReservationsConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.manualReservationFacade.selectedSlot$,
        this.calendarsFacade.calendarsFilter$
      ),
      switchMap(
        ([
          _,
          params,
          selectedCorporate,
          selectedBranch,
          slot,
          calendarsFilter,
        ]) => {
          if (
            !params ||
            !selectedCorporate ||
            !selectedBranch ||
            !slot ||
            !calendarsFilter
          ) {
            return [CalendarsActions.GoToCalendarList()];
          }
          const { selectedTypes } = calendarsFilter;
          const filters = {
            ['corporate.uuid']: selectedCorporate.uuid,
            ['branch.uuid']: selectedBranch.uuid,
            ['calendar.slot']: slot.iso,
            ['calendar.serviceTypes']: selectedTypes,
          };

          return this.manualReservationsService
            .getManualReservations(params, filters)
            .pipe(
              map((data: IManualReservations.IData) =>
                ManualReservationsActions.LoadManualReservationsSuccess({
                  payload: {
                    manualReservations: data.docs,
                    pagination: {
                      limit: data.limit,
                      page: data.page,
                      pages: data.pages,
                      total: data.total,
                    },
                  },
                })
              ),
              catchError((res: any) => {
                const message =
                  res.status !== 401 ? res.error.response.message : null;
                return of(
                  ManualReservationsActions.LoadManualReservationsFail({
                    payload: {
                      status: res.status,
                      message,
                    },
                  })
                );
              })
            );
        }
      )
    )
  );

  handleSelectCalendarSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.SelectCalendarSlot.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/calendar/reserve'],
          },
        });
      })
    )
  );

  getSaleAdvisors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetManualReservationOperations.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, selectedCorporate, selectedBranch]) => {
        const { uuid } = selectedCorporate;

        // todo: remove
        const config: IManualReservations.IConfig = {
          limit: 1000,
          page: 1,
        };

        return this.manualReservationsService
          .getOperationAccounts(uuid, selectedBranch.uuid, config)
          .pipe(
            map((data: IManualReservations.IOperationData) =>
              ManualReservationsActions.GetManualReservationOperationsSuccess({
                payload: data.docs,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.GetManualReservationOperationsFail({
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

  getDMSCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetDMSCustomers.type),
      map((action) => action.payload),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([payload, selectedCorporate, selectedBranch]) => {
        return this.manualReservationsService
          .getDMSCustomers(
            payload.dms,
            selectedCorporate.uuid,
            selectedBranch.uuid
          )
          .pipe(
            map((data: IManualReservations.IDMSCustomer[]) =>
              ManualReservationsActions.GetDMSCustomersSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.GetDMSCustomersFail({
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

  handleGetDMSCustomersFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.GetDMSCustomersFail.type),
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

  getDMSVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetDMSVehicles.type),
      map((action) => action.payload),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([payload, selectedCorporate, selectedBranch]) => {
        return this.manualReservationsService
          .getDMSVehicles(payload, selectedCorporate.uuid, selectedBranch.uuid)
          .pipe(
            map((data: IReservations.IAccountVehicle[]) =>
              ManualReservationsActions.GetDMSVehiclesSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error?.response?.message : null;
              return of(
                ManualReservationsActions.GetDMSVehiclesFail({
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

  handleGetDMSVehiclesFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.GetDMSVehiclesFail.type),
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

  createManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.CreateManualReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .createManualReservation(payload)
          .pipe(
            switchMap((reservation: IManualReservations.IDocument) => {
              return [
                ManualReservationsActions.CreateManualReservationSuccess({
                  payload: reservation,
                }),
                // ManualReservationsActions.UpdateCalendar(),
              ];
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res?.error?.response?.message : null;
              return of(
                ManualReservationsActions.CreateManualReservationFail({
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

  handleCreateManualReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.CreateManualReservationSuccess.type),
      map((action) => {
        const { referenceNumber } = action.payload;
        this.toggleSnackbar(`${referenceNumber} has been created.`);
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

  handleCreateManualReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.CreateManualReservationFail.type),
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

  updateManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.UpdateManualReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .updateManualReservation(payload)
          .pipe(
            map((reservation: IManualReservations.IDocument) => {
              return ManualReservationsActions.UpdateManualReservationSuccess({
                payload: {
                  id: reservation.uuid,
                  changes: reservation,
                },
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.UpdateManualReservationFail({
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

  handleUpdateManualReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.UpdateManualReservationSuccess.type),
      map((action) => {
        const { referenceNumber } = action.payload.changes;
        this.toggleSnackbar(`${referenceNumber} has been updated.`);
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

  handleUpdateManualReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.UpdateManualReservationFail.type),
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

  deleteManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.DeleteManualReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .deleteManualReservation(payload)
          .pipe(
            switchMap((reservation: IManualReservations.IDocument) => {
              return [
                ManualReservationsActions.DeleteManualReservationSuccess({
                  payload: reservation,
                }),
                ManualReservationsActions.UpdateCalendar(),
              ];
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.DeleteManualReservationFail({
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

  deleteManualMobileReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.DeleteManualMobileReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .deleteManualReservation(payload)
          .pipe(
            map((reservation: IManualReservations.IDocument) =>
              ManualReservationsActions.DeleteManualMobileReservationSuccess({
                payload: reservation,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.DeleteManualMobileReservationFail({
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

  deleteManualServiceReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.DeleteManualServiceReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .deleteManualReservation(payload)
          .pipe(
            map((reservation: IManualReservations.IDocument) =>
              ManualReservationsActions.DeleteManualServiceReservationSuccess({
                payload: reservation,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.DeleteManualServiceReservationFail({
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

  updateCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.UpdateCalendar.type),
      withLatestFrom(this.manualReservationFacade.selectedDay$),
      map(([_, selectedDay]) => {
        return CalendarsActions.UpdateDay({
          payload: {
            id: selectedDay?.uuid,
            changes: selectedDay,
          },
        });
      })
    )
  );

  handleDeleteManualReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ManualReservationsActions.DeleteManualReservationSuccess.type,
          ManualReservationsActions.DeleteManualMobileReservationSuccess.type,
          ManualReservationsActions.DeleteManualServiceReservationSuccess.type
        ),
        map((action) => {
          const { referenceNumber } = action.payload;
          this.toggleSnackbar(`${referenceNumber} has been deleted.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleDeleteManualReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ManualReservationsActions.DeleteManualReservationFail.type,
          ManualReservationsActions.DeleteManualMobileReservationFail.type,
          ManualReservationsActions.DeleteManualServiceReservationFail.type
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

  getManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetManualReservation.type),
      map((action) => action.payload),
      switchMap((payload: string) => {
        return this.manualReservationsService
          .getManualReservation(payload)
          .pipe(
            map((reservation: IManualReservations.IDocument) => {
              return ManualReservationsActions.GetManualReservationSuccess({
                payload: reservation,
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.GetManualReservationFail({
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

  AddNewManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.AddNewManualReservation.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/service-center/scheduled/new'],
          },
        });
      })
    )
  );

  completeManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.CompleteManualReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .completeManualReservation(payload)
          .pipe(
            switchMap((reservation: IManualReservations.IDocument) => {
              return [
                ManualReservationsActions.CompleteManualReservationSuccess({
                  payload: {
                    id: reservation.uuid,
                    changes: {
                      referenceNumber: reservation.referenceNumber,
                    },
                  },
                }),
                ManualReservationsActions.UpdateCalendar(),
              ];
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.CompleteManualReservationFail({
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

  handleCompleteManualReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.CompleteManualReservationSuccess.type),
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

  handleCompleteManualReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.CompleteManualReservationFail.type),
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

  resetManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.ResetManualReservation.type),
      map((action) => action.payload),
      switchMap((payload: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .resetManualReservation(payload)
          .pipe(
            switchMap((reservation: IManualReservations.IDocument) => {
              return [
                ManualReservationsActions.ResetManualReservationSuccess({
                  payload: {
                    id: reservation.uuid,
                    changes: {
                      referenceNumber: reservation.referenceNumber,
                    },
                  },
                }),
                ManualReservationsActions.UpdateCalendar(),
              ];
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.ResetManualReservationFail({
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

  handleResetManualReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.ResetManualReservationSuccess.type),
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

  handleResetManualReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.ResetManualReservationFail.type),
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

  cancelManualReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.CancelManualReservation.type),
      map((action) => action.payload),
      switchMap((reservation: IManualReservations.IDocument) => {
        return this.manualReservationsService
          .cancelManualReservation(reservation)
          .pipe(
            map(() =>
              ManualReservationsActions.CancelManualReservationSuccess({
                payload: {
                  id: reservation.uuid,
                  changes: {
                    referenceNumber: reservation.referenceNumber,
                  },
                },
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ManualReservationsActions.CancelManualReservationFail({
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

  handleCancelManualReservationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.CancelManualReservationSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          this.toggleSnackbar(`${referenceNumber} has been cancelled.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCancelManualReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ManualReservationsActions.CancelManualReservationFail.type),
        map((action) => {
          const message = action.payload.message;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleGoToReservationsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GoToReservationsList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/service-center/scheduled'],
          },
        });
      })
    )
  );

  getMakes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetVehicleMakes.type),
      map((action) => action.payload),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([payload, selectedCorporate, selectedBranch]) => {
        const params: IManualReservations.IConfig = {
          limit: 2000,
          page: 1,
        }
        return this.manualReservationsService
          .getVehicleMakes(selectedCorporate.uuid, selectedBranch.uuid, params)
          .pipe(
            map((data: IManualReservations.IVehicleMakes[]) =>
              ManualReservationsActions.GetVehicleMakesSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error?.response?.message : null;
              return of(
                ManualReservationsActions.GetVehicleMakesFail({
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

  getModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetVehicleModels.type),
      map((action) => action.payload),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([payload, selectedCorporate, selectedBranch]) => {
        const params: IManualReservations.IConfig = {
          limit: 2000,
          page: 1,
        }
        return this.manualReservationsService
          .getVehicleModels(payload, selectedCorporate.uuid, selectedBranch.uuid, params)
          .pipe(
            map((data: IManualReservations.IVehicleModels[]) =>
              ManualReservationsActions.GetVehicleModelsSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error?.response?.message : null;
              return of(
                ManualReservationsActions.GetVehicleModelsFail({
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

  getYearMakes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ManualReservationsActions.GetVehicleYearMakes.type),
      map((action) => action),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([payload, selectedCorporate, selectedBranch]) => {
        const params: IManualReservations.IConfig = {
          limit: 2000,
          page: 1,
        }
        return this.manualReservationsService
          .getVehicleYearMakes(payload.makeId, payload.modelId, selectedCorporate.uuid, selectedBranch.uuid, params)
          .pipe(
            map((data: IManualReservations.IVehicleYearMakes[]) =>
              ManualReservationsActions.GetVehicleYearMakesSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error?.response?.message : null;
              return of(
                ManualReservationsActions.GetVehicleYearMakesFail({
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

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
