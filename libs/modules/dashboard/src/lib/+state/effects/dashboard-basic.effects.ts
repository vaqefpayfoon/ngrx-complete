import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { DashboardBasicActions } from '../actions';

// Services
import { DashboardService } from '../../services';

// Models
import { IDashboard } from '../../models';

// RxJs
import { EMPTY, from, of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom,
  tap,
  flatMap,
  mergeMap,
} from 'rxjs/operators';

// Facades
import { AuthFacade, AuthActions } from '@neural/auth';
import { DashboardBasicFacade } from '../facades';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class DashboardBasicEffects {
  constructor(
    private actions$: Actions<DashboardBasicActions.DashboardBasicActionsUnion>,
    private dashboardService: DashboardService,
    private authFacade: AuthFacade,
    private dashboardBasicFacade: DashboardBasicFacade,
    private snackBar: MatSnackBar
  ) {}

  loadDashboardBasic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardBasicActions.LoadDashboardBasic.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, params]) => {
        const { uuid } = params;
        return this.dashboardService.getBasicDashboard(uuid).pipe(
          map((basic: IDashboard.IBasic) =>
            DashboardBasicActions.LoadDashboardBasicSuccess({
              payload: basic,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              DashboardBasicActions.LoadDashboardBasicFail({
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

  handleSelectCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SelectCorporate.type),
      withLatestFrom(this.dashboardBasicFacade.getRouter$),
      map(([_, router]) => {
        if (router?.state?.url === '/app/home/basic') {
          return DashboardBasicActions.LoadDashboardBasic();
        }
        return DashboardBasicActions.ResetLoadedDasboardBasic();
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
