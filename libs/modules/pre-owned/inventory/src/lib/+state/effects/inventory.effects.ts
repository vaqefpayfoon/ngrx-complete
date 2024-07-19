import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { InventoryActions } from '../actions';

// Services
import { InventoryService } from '../../services';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

//Auth facade
import { AuthFacade } from '@neural/auth';

// Models
import { IInventory } from '../../models';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class InventoryEffects {
  constructor(
    private actions$: Actions<InventoryActions.InventoryActionsUnion>,
    private inventoryService: InventoryService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  getInventoryImports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.getPreOwnedImports.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const corporateUuid = corporate.uuid;

        return this.inventoryService
          .getPreOwnedImportsFireBase(corporateUuid)
          .pipe(
            map((data) =>
              InventoryActions.getPreOwnedImportsSuccess({
                inventories: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                InventoryActions.getPreOwnedImportsFail({
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
}
