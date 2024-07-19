import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { BrandsFlatRateUnitActions } from '../actions';

// Services
import { BrandsFlatRateUnitService } from '../../services';

// Models
import { IBrandsFlatRateUnit } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facade
import { AuthFacade } from '@neural/auth';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class BrandsFlatRateUnitEffects {
  constructor(
    private actions$: Actions<
      BrandsFlatRateUnitActions.BrandsFlatRateUnitActionsUnion
    >,
    private brandsFlatRateUnitService: BrandsFlatRateUnitService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  getBrandsFlatRateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsFlatRateUnitActions.GetBrandsFlatRateUnit.type),
      withLatestFrom(this.authFacade.corporates$),
      switchMap(([_, params]) => {
        const [
          {
            uuid: corporateUuid,
            branches: [{ uuid: branchUuid }],
          },
        ] = params;

        const entryPaylod: IBrandsFlatRateUnit.IGetBrandsFru = {
          branchUuid,
          corporateUuid,
        };

        return this.brandsFlatRateUnitService
          .getBrandsFlatRateUnit(entryPaylod)
          .pipe(
            map(
              ({
                brandsFlatRateUnit,
                remainingBrands,
              }: IBrandsFlatRateUnit.IData) => {
                return BrandsFlatRateUnitActions.GetBrandsFlatRateUnitSuccess({
                  payload: {
                    brandsFlatRateUnit,
                    remainingBrands,
                  },
                });
              }
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                BrandsFlatRateUnitActions.GetBrandsFlatRateUnitFail({
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

  setBrandsFlatRateUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsFlatRateUnitActions.SetBrandsFlatRateUnit.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.brandsFlatRateUnitService.setBrandsFlatRateUnit(payload).pipe(
          map(() => BrandsFlatRateUnitActions.SetBrandsFlatRateUnitSuccess()),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BrandsFlatRateUnitActions.SetBrandsFlatRateUnitFail({
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

  handleSetBrandsFlatRateUnitSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandsFlatRateUnitActions.SetBrandsFlatRateUnitSuccess),
      map(() =>
        this.toggleSnackbar(`Brands flat rate units has been updated.`)
      ),
      switchMap(() => [
        fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/vehicles/coverages'],
          },
        }),
        BrandsFlatRateUnitActions.GetBrandsFlatRateUnit(),
      ])
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
