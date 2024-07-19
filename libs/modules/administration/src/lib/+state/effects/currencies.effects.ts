import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CurrenciesActions } from '../actions';

// Services
import { CurrenciesService } from '../../services';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CurrenciesEffects {
  constructor(
    private actions$: Actions<CurrenciesActions.CurrenciesActionsUnion>,
    private currenciesService: CurrenciesService,
    private snackBar: MatSnackBar
  ) {}

  loadCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrenciesActions.LoadCurrencies.type),
      switchMap(() => {
        return this.currenciesService.getCurrencies().pipe(
          map((currencies: string[]) =>
            CurrenciesActions.LoadCurrenciesSuccess({ payload: currencies })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CurrenciesActions.LoadCurrenciesFail({ payload: message })
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
      panelClass: ['snackbar--custom']
    });
  }
}
