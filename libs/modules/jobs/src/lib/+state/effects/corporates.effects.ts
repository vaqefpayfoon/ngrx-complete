import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ReservationsActions } from '../actions';

// Models
import { ICorporates } from '@neural/modules/customer/corporate';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { AuthFacade } from '@neural/auth';

//service
import { ReservationsService } from '../../services';

@Injectable()
export class CorporatesEffects {
  constructor(
    private actions$: Actions<ReservationsActions.ReservationsActionsUnion>,
    private reservationsService: ReservationsService,
    private snackBar: MatSnackBar
  ) {}


  loadCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservationsActions.LoadCorporate.type),
      map((action) => action.payload),
      switchMap((uuid: string) => {
        return this.reservationsService.getCorporate(uuid).pipe(
          map((corporate: ICorporates.IDocument) =>
          ReservationsActions.LoadCorporateSuccess({ payload: corporate })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error?.response?.message : null;
            return of(
              ReservationsActions.LoadCorporateFail({ payload: message })
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
