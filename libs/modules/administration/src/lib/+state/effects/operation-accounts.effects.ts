import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { OperationAccountsActions } from '../actions';

// Services
import { AccountsService } from '../../services';

// Models
import { IAccount } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import { OperationAccountsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class OperationAccountsEffects {
  constructor(
    private actions$: Actions<
      OperationAccountsActions.OperationAccountsActionsUnion
    >,
    private accountsService: AccountsService,
    private operationAccountsFacade: OperationAccountsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setOperationAccountsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.SetOperationAccountsPage.type),
      map(() => OperationAccountsActions.LoadOperationAccounts())
    )
  );

  filterAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.FilterOperationAccounts.type),
      map(() => OperationAccountsActions.LoadOperationAccounts())
    )
  );

  sortAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.SortOperationAccounts.type),
      map(() => OperationAccountsActions.LoadOperationAccounts())
    )
  );

  resetFilerAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.ResetFilterOperationAccounts.type),
      map(() => OperationAccountsActions.LoadOperationAccounts())
    )
  );

  loadOperationAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.LoadOperationAccounts.type),
      withLatestFrom(
        this.operationAccountsFacade.accountsConfig$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, params, corporate]) => {
        const { uuid } = corporate;
        return this.accountsService.getOperationAccounts(params, uuid).pipe(
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

  deleteOperationAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.DeleteOperationAccount.type),
      map(action => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.deleteAccount(account).pipe(
          map(() =>
            OperationAccountsActions.DeleteOperationAccountSuccess({
              payload: account
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.DeleteOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleDeleteOperationAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.DeleteOperationAccountSuccess.type),
        map(action => {
          const {
            identity: { fullName }
          } = action.payload;
          this.toggleSnackbar(`${fullName} has been deleted`);
          return action.payload;
        }),
        map(() => OperationAccountsActions.RedirectToOperationAccounts())
      )
  );

  handleDeleteOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.DeleteOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  activeOperationAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.ActivateOperationAccount.type),
      map(action => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.activateAccount(account).pipe(
          map(() =>
            OperationAccountsActions.ActivateOperationAccountSuccess({
              payload: {
                id: account.uuid,
                changes: {
                  active: !account.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.ActivateOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleActivateOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.ActivateOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  deactivateOperationAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.DeactivateOperationAccount.type),
      map(action => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.deactivateAccount(account).pipe(
          map(() =>
            OperationAccountsActions.DeactivateOperationAccountSuccess({
              payload: {
                id: account.uuid,
                changes: {
                  active: !account.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.DeactivateOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleDeactivateOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.DeactivateOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  getOperationAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.GetOperationAccount.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.accountsService.getAccount(payload).pipe(
          map(account =>
            OperationAccountsActions.GetOperationAccountSuccess({
              payload: account
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.GetOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleGetOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.GetOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => OperationAccountsActions.RedirectToOperationAccounts())
      )
  );

  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.UpdateOperationAccount.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.accountsService.updateAccount(payload).pipe(
          map(account =>
            OperationAccountsActions.UpdateOperationAccountSuccess({
              payload: {
                id: account.uuid,
                changes: account
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.UpdateOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleUpdateOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.UpdateOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleUpdateOperationAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.UpdateOperationAccountSuccess.type),
      map(action => {
        const { identity } = action.payload.changes;
        this.toggleSnackbar(`${identity.fullName} has been updated.`);
        return action.payload;
      }),
      map(() => OperationAccountsActions.RedirectToOperationAccounts())
    )
  );

  updateOperationPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.UpdateOperationPassword.type),
      map(action => action.payload),
      switchMap((payload: IAccount.IUpdatePass) => {
        return this.accountsService.updateAccountPassword(payload).pipe(
          map(account =>
            OperationAccountsActions.UpdateOperationPasswordSuccess({
              payload: account
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.UpdateOperationPasswordFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleUpdateOperationPasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.UpdateOperationPasswordSuccess.type),
      map(action => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} password has been updated.`);
        return action.payload;
      }),
      map(() => OperationAccountsActions.RedirectToOperationAccounts())
    )
  );

  handleUpdateOperationPasswordFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.UpdateOperationPasswordFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  createAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.CreateOperationAccount.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.accountsService.createAccount(payload).pipe(
          map(account =>
            OperationAccountsActions.CreateOperationAccountSuccess({
              payload: account
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.CreateOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleCreateOperationAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.CreateOperationAccountSuccess.type),
      map(action => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} has been created.`);
        return action.payload;
      }),
      map(() => OperationAccountsActions.RedirectToOperationAccounts())
    )
  );

  handleCreateOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.CreateOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleRedirectToAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.RedirectToOperationAccounts.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/operation']
          }
        });
      })
    )
  );

  resyncOperationAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationAccountsActions.ResyncOperationAccount.type),
      map(action => action.payload),
      switchMap((payload: IAccount.IDocument) => {
        return this.accountsService.resyncAccount(payload).pipe(
          map(account =>
            OperationAccountsActions.ResyncOperationAccountSuccess({
              payload: account
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OperationAccountsActions.ResyncOperationAccountFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleResyncOperationAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.ResyncOperationAccountSuccess.type),
        map(action => {
          const { identity } = action.payload;
          this.toggleSnackbar(`${identity.fullName} has been resynced.`);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleResyncOperationAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(OperationAccountsActions.ResyncOperationAccountFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
