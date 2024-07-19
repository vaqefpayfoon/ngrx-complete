import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ReservationsActions } from '../actions';

// Services
import { ReservationsService } from '../../services';

// Models
import { IReservations } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { ReservationsFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class ReservationsEffects {
  constructor(
    private actions$: Actions<ReservationsActions.ReservationsActionsUnion>,
    private reservationsService: ReservationsService,
    private reservationsFacade: ReservationsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setReservationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.SetReservationPage.type),
      map(() => ReservationsActions.LoadReservations())
    )
  );

  loadReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.LoadReservations.type),
      withLatestFrom(
        this.reservationsFacade.reservationsConfig$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, params, branch]) => {
        const { uuid } = branch;
        return this.reservationsService.getReservations(uuid, params).pipe(
          map((data: IReservations.IData) =>
            ReservationsActions.LoadReservationsSuccess({
              reservations: data.docs,
              pagination: {
                limit: data.limit,
                page: data.page,
                pages: data.pages,
                total: data.total
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              ReservationsActions.LoadReservationsFail({ payload: message })
            );
          })
        );
      })
    )
  );

  getReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.GetReservation.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.getReservation(payload).pipe(
          map((data: IReservations.IDocument) =>
            ReservationsActions.GetReservationSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              ReservationsActions.GetReservationFail({
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

  handleGetReservationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservationsActions.GetReservationFail.type),
        map((action) => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => ReservationsActions.GoToDeclinedList())
      )
  );

  handleGoToDeclinedList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.GoToDeclinedList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/mobile/declined']
          }
        });
      })
    )
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
