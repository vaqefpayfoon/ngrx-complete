import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CustomerAccountsActions } from '../actions';

// Models
import { ICorporates } from '@neural/modules/customer/corporate';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { AuthFacade } from '@neural/auth';

//service
import { AccountsService } from '../../services';

@Injectable()
export class CorporatesEffects {
  constructor(
    private actions$: Actions<CustomerAccountsActions.CustomerAccountsActionsUnion>,
    private accountsService: AccountsService,
    private snackBar: MatSnackBar
  ) {}


  loadCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.LoadCorporate.type),
      map((action) => action.payload),
      switchMap((uuid: string) => {
        return this.accountsService.getCorporate(uuid).pipe(
          map((corporate: ICorporates.IDocument) =>
          CustomerAccountsActions.LoadCorporateSuccess({ payload: corporate })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error?.response?.message : null;
            return of(
              CustomerAccountsActions.LoadCorporateFail({ payload: message })
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
