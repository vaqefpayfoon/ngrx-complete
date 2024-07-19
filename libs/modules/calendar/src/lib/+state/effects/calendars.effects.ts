import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CalendarsActions } from '../actions';

// Services
import { CalendarsService } from '../../services';

// Models
import { ICalendars } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { CalendarsFacade } from '../facades';
import { AuthFacade, AuthActions } from '@neural/auth';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class CalendarsEffects {
  constructor(
    private actions$: Actions<
      CalendarsActions.CalendarsActionsUnion | AuthActions.AuthActionsUnion
    >,
    private calendarsService: CalendarsService,
    private calendarsFacade: CalendarsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setBusinessesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.ChangeCalendarsFilter.type),
      map(() => CalendarsActions.LoadCalendars())
    )
  );

  selectBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SelectBranch.type),
      map(() => CalendarsActions.ResetCalendarsFilter())
    )
  );

  loadCalendars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.LoadCalendars.type),
      withLatestFrom(
        this.calendarsFacade.calendarsFilter$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, params, selectedBranch]) => {
        const filters: ICalendars.IGetCalendar = {
          ...params,
          branchUuid: selectedBranch.uuid,
        };

        return this.calendarsService.getCalendar(filters).pipe(
          map((data: ICalendars.IDocument[]) =>
            CalendarsActions.LoadCalendarsSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CalendarsActions.LoadCalendarsFail({
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

  handleRedirectToCalendarsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.RedirectToCalendarsList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/calendar'],
          },
        });
      })
    )
  );

  updateCalendarSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.UpdateCalendarSlot.type),
      map((action) => action.payload),
      switchMap((payload: ICalendars.IUpdateCalendarSlot) => {
        return this.calendarsService.updateCalendarSlot(payload).pipe(
          map((calendar: ICalendars.IDocument) => {
            return CalendarsActions.UpdateCalendarSlotSuccess({
              payload: {
                document: {
                  id: calendar.uuid,
                  changes: calendar,
                },
                slot: payload,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CalendarsActions.UpdateCalendarSlotFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleUpdateCalendarSlotSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CalendarsActions.UpdateCalendarSlotSuccess.type),
        map((action) => {
          const { time, isBlocked } = action.payload.slot;
          return this.toggleSnackbar(
            `${time} has been ` + (isBlocked ? 'blocked' : 'unblocked')
          );
        })
      ),
    { dispatch: false }
  );

  handleUpdateCalendarSlotFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CalendarsActions.UpdateCalendarSlotFail.type),
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

  updateCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.UpdateCalendar.type),
      map((action) => action.payload),
      switchMap((payload: ICalendars.IUpdateInternalCalendar) => {
        return this.calendarsService.updateCalendar(payload).pipe(
          map((calendar: ICalendars.IDocument) => {
            return CalendarsActions.UpdateCalendarSuccess({
              payload: {
                document: {
                  id: calendar.uuid,
                  changes: calendar,
                },
                day: payload,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CalendarsActions.UpdateCalendarFail({
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

  handleUpdateCalendarSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CalendarsActions.UpdateCalendarSuccess.type),
        map((action) => {
          const { day, isBlocked } = action.payload.day;
          return this.toggleSnackbar(
            `${day} has been ` + (isBlocked ? 'blocked' : 'unblocked')
          );
        })
      ),
    { dispatch: false }
  );

  handleUpdateCalendarFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CalendarsActions.UpdateCalendarFail.type),
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

  createCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.CreateCalendar.type),
      map((action) => action.payload),
      switchMap((payload: ICalendars.IGenerateInternalCalendars) => {
        return this.calendarsService.generateCalendar(payload).pipe(
          map((message: string) => {
            return CalendarsActions.CreateCalendarSuccess({
              payload: message,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CalendarsActions.CreateCalendarFail({
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

  handleCreateCalendarFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CalendarsActions.CreateCalendarFail.type),
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

  handleCreateCalendarSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.CreateCalendarSuccess.type),
      map(() => {
        this.toggleSnackbar('Calendar has been generated.');
        return CalendarsActions.GoToCalendarList();
      })
    )
  );

  handleGoToServicesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarsActions.GoToCalendarList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/calendar'],
          },
        });
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
