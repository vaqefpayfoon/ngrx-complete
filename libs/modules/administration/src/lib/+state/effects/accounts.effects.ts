import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { AccountsActions } from '../actions';

// Services
import { AccountsService } from '../../services';

// Models
import { IAccount } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { AccountsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class AccountsEffects {
  constructor(
    private actions$: Actions<AccountsActions.AccountsActionsUnion>,
    private accountsService: AccountsService,
    private accountsFacade: AccountsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setAccountsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.SetAccountsPage.type),
      map(() => AccountsActions.LoadAccounts())
    )
  );

  filterAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.FilterAccounts.type),
      map(() => AccountsActions.LoadAccounts())
    )
  );

  sortAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.SortAccounts.type),
      map(() => AccountsActions.LoadAccounts())
    )
  );

  resetFilerAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.ResetFilterAccounts.type),
      map(() => AccountsActions.LoadAccounts())
    )
  );

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.LoadAccounts.type),
      withLatestFrom(
        this.accountsFacade.accountsConfig$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, params, corporate]) => {
        const { uuid } = corporate;
        return this.accountsService.getAccounts(params, uuid).pipe(
          map((data: IAccount.IData) =>
            AccountsActions.LoadAccountsSuccess({
              accounts: data.docs,
              pagination: {
                limit: data.limit,
                page: data.page,
                pages: data.pages,
                total: data.total,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AccountsActions.LoadAccountsFail({
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

  activeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.ActivateAccount.type),
      map((action) => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.activateAccount(account).pipe(
          map(() =>
            AccountsActions.ActivateAccountSuccess({
              payload: {
                id: account.uuid,
                changes: {
                  active: !account.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AccountsActions.ActivateAccountFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleActivateAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.ActivateAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  deactivateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.DeactivateAccount.type),
      map((action) => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.deactivateAccount(account).pipe(
          map(() =>
            AccountsActions.DeactivateAccountSuccess({
              payload: {
                id: account.uuid,
                changes: {
                  active: !account.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AccountsActions.DeactivateAccountFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleDeactivateAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.DeactivateAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.DeleteAccount.type),
      map((action) => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.deleteAccount(account).pipe(
          map(() =>
            AccountsActions.DeleteAccountSuccess({
              payload: account,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.DeleteAccountFail({ payload: message }));
          })
        );
      })
    )
  );

  handleDeleteAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.DeleteAccountSuccess.type),
      map((action) => {
        const {
          identity: { fullName },
        } = action.payload;
        this.toggleSnackbar(`${fullName} has been deleted`);
        return action.payload;
      }),
      map(() => AccountsActions.RedirectToAccounts())
    )
  );

  handleDeleteAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.DeleteAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  getAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.GetAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.getAccount(payload).pipe(
          map((account) =>
            AccountsActions.GetAccountSuccess({ payload: account })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.GetAccountFail({ payload: message }));
          })
        );
      })
    )
  );

  handleGetAccountFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.GetAccountFail.type),
      map((action) => {
        const message = action.payload.message;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => AccountsActions.RedirectToAccounts())
    )
  );

  searchAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.SearchAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.getAccountByEmail(payload).pipe(
          map((account) =>
            AccountsActions.SearchAccountSuccess({ payload: account })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.SearchAccountFail({ payload: message }));
          })
        );
      })
    )
  );

  handleSearchAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.SearchAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  createAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.CreateAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.createAccount(payload).pipe(
          map((account) =>
            AccountsActions.CreateAccountSuccess({ payload: account })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.CreateAccountFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.CreateAccountSuccess.type),
      map((action) => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} has been created.`);
        return action.payload;
      }),
      map(() => AccountsActions.RedirectToAccounts())
    )
  );

  handleCreateAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.CreateAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  updateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.UpdateAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.updateAccount(payload).pipe(
          map((account) =>
            AccountsActions.UpdateAccountSuccess({
              payload: {
                id: account.uuid,
                changes: account,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.UpdateAccountFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdateAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.UpdateAccountSuccess.type),
      map((action) => {
        const { identity } = action.payload.changes;
        this.toggleSnackbar(`${identity.fullName} has been updated.`);
        return action.payload;
      }),
      map(() => AccountsActions.RedirectToAccounts())
    )
  );

  handleUpdateAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.UpdateAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  updateSearchedAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.UpdateSearchedAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.updateAccount(payload).pipe(
          map((account) =>
            AccountsActions.UpdateSearchedAccountSuccess({
              payload: account,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AccountsActions.UpdateSearchedAccountFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleUpdateSearchedAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.UpdateSearchedAccountSuccess.type),
      map((action) => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} has been updated.`);
        return action.payload;
      }),
      map(() => AccountsActions.RedirectToAccounts())
    )
  );

  handleUpdateSearchedAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.UpdateSearchedAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.UpdatePassword.type),
      map((action) => action.payload),
      switchMap((payload: IAccount.IUpdatePass) => {
        return this.accountsService.updateAccountPassword(payload).pipe(
          map((account) =>
            AccountsActions.UpdatePasswordSuccess({ payload: account })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.UpdatePasswordFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdatePasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.UpdatePasswordSuccess.type),
      map((action) => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} password has been updated.`);
        return action.payload;
      }),
      map(() => AccountsActions.RedirectToAccounts())
    )
  );

  handleUpdatePasswordFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.UpdatePasswordFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleRedirectToAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.RedirectToAccounts.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/account'],
          },
        });
      })
    )
  );

  resyncAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.ResyncAccount.type),
      map((action) => action.payload),
      switchMap((payload: IAccount.IDocument) => {
        return this.accountsService.resyncAccount(payload).pipe(
          map((account) =>
            AccountsActions.ResyncAccountSuccess({ payload: account })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.ResyncAccountFail({ payload: message }));
          })
        );
      })
    )
  );

  handleResyncAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.ResyncAccountSuccess.type),
        map((action) => {
          const { identity } = action.payload;
          this.toggleSnackbar(`${identity.fullName} has been resynced.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleResyncAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.ResyncAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  resyncFirebase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.ResyncFirebase.type),
      map((action) => action.payload),
      switchMap((payload: IAccount.IDocument) => {
        return this.accountsService.resyncFirebase(payload).pipe(
          map((account) =>
            AccountsActions.ResyncFirebaseSuccess({ payload: account })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AccountsActions.ResyncFirebaseFail({ payload: message }));
          })
        );
      })
    )
  );

  handleResyncFirebaseSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.ResyncFirebaseSuccess.type),
        map((action) => {
          const { identity } = action.payload;
          this.toggleSnackbar(`${identity.fullName} has been resynced.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleResyncFirebaseFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.ResyncAccountFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  synchronization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.Synchronization.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([synchronization, corporate]) => {
        const { uuid } = corporate;
        return this.accountsService
          .importExcelAccounts(synchronization, uuid)
          .pipe(
            map((payload) =>
              AccountsActions.SynchronizationSuccess({ payload })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                AccountsActions.SynchronizationFail({ payload: message })
              );
            })
          );
      })
    )
  );

  handleSynchronizationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.SynchronizationSuccess.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleSynchronizationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.SynchronizationFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
