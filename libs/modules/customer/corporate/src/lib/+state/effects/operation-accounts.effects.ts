import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { OperationAccountsActions } from '../actions';


// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';
import { IAccount } from '@neural/modules/administration';
import { BranchesService } from '../../services';
import { BranchFacade, CorporatesFacade } from '../facades';

@Injectable()
export class OperationAccountsEffects {
  constructor(
    private actions$: Actions<
      OperationAccountsActions.OperationAccountsActionsUnion
    >,
    private branchService: BranchesService,
    private branchFacade: BranchFacade,
    private corporateFacade: CorporatesFacade,
    private snackBar: MatSnackBar
  ) {}



  loadOperationAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.LoadOperationAccounts.type),
      map(action => action.payload),
      // withLatestFrom(
      //   this.corporateFacade.corporate$,
      //   this.branchFacade.selectedBranch$
      // ),
      // switchMap(([type, corporate, branch]) => {
      switchMap((payload) => {
        return this.branchService.getOperationAccounts(payload.corporateUuid, payload.branchUuid, payload.type).pipe(
          map((data: IAccount.IData) =>
            OperationAccountsActions.LoadOperationAccountsSuccess({
              accounts: data.docs,
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
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.LoadOperationAccountsFail({
                payload: message
              })
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
