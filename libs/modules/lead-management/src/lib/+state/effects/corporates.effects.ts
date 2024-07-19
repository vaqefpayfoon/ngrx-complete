import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CorporatesActions } from '../actions';

// Services
import { CorporatesService } from '../../services';

// Models
import { ICorporates } from '../../models';

// RxJs
import { of, Observable, from } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { CorporatesFacade } from '../facades';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

// Facades
import { AuthFacade } from '@neural/auth';

@Injectable()
export class CorporatesEffects {
  constructor(
    private actions$: Actions<CorporatesActions.CorporatesActionsUnion>,
    private corporatesService: CorporatesService,
    private corporatesFacade: CorporatesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}


  loadCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.LoadCorporate.type),
      map((action) => action.payload),
      switchMap((uuid: string) => {
        return this.corporatesService.getCorporate(uuid).pipe(
          map((corporate: ICorporates.IDocument) =>
            CorporatesActions.LoadCorporateSuccess({ payload: corporate })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.LoadCorporateFail({ payload: message })
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
