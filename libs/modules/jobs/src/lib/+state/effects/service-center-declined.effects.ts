import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ServiceCenterDeclinedActions } from '../actions';

// Services
import { ReservationsService } from '../../services';

// Models
import { IReservations } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { ServiceCenterDeclinedFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class ServiceCenterDeclinedEffects {
  constructor(
    private actions$: Actions<ServiceCenterDeclinedActions.ServicesCenterDeclinedActionsUnion>,
    private reservationsService: ReservationsService,
    private serviceCenterDeclinedFacade: ServiceCenterDeclinedFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setServiceCenterDeclinedPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterDeclinedActions.SetServiceCenterDeclinedPage.type),
      map(() => ServiceCenterDeclinedActions.LoadServicesCenterDeclined())
    )
  );

  loadServicesCenterDeclined$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterDeclinedActions.LoadServicesCenterDeclined.type),
      withLatestFrom(
        this.serviceCenterDeclinedFacade.reservationsConfig$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, params, branch]) => {
        const { uuid } = branch;
        return this.reservationsService.getReservations(uuid, params).pipe(
          map((data: IReservations.IData) =>
            ServiceCenterDeclinedActions.LoadServicesCenterDeclinedSuccess({
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
              ServiceCenterDeclinedActions.LoadServicesCenterDeclinedsFail({ payload: message })
            );
          })
        );
      })
    )
  );

  getServiceCenterDeclined$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterDeclinedActions.GetServiceCenterDeclined.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.reservationsService.getReservation(payload).pipe(
          map((data: IReservations.IDocument) =>
            ServiceCenterDeclinedActions.GetServiceCenterDeclinedSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              ServiceCenterDeclinedActions.GetServiceCenterDeclinedFail({
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

  handleGetServiceCenterDeclinedFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceCenterDeclinedActions.GetServiceCenterDeclinedFail.type),
        map((action) => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => ServiceCenterDeclinedActions.GoToServicesCenterDeclinedList())
      )
  );

  handleGoToServicesCenterDeclinedList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceCenterDeclinedActions.GoToServicesCenterDeclinedList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/service-center/declined']
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
