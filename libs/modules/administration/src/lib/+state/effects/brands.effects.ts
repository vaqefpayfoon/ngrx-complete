import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { BrandsActions } from '../actions';

// Services
import { AccountsService } from '../../services';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class BrandsEffects {
  constructor(
    private actions$: Actions<BrandsActions.BrandsActionsUnion>,
    private accountsService: AccountsService
  ) {}

  getGlobalBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsActions.GetGlobalBrands.type),
      switchMap(() => {
        return this.accountsService.getGlobalVehicleBrands().pipe(
          map((payload) => BrandsActions.GetGlobalBrandsSuccess({ payload })),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(BrandsActions.GetGlobalBrandsFail({ payload: message }));
          })
        );
      })
    )
  );
}
