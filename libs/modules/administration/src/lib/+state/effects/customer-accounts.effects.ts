import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CustomerAccountsActions } from '../actions';

// Services
import { AccountsService } from '../../services';

// Models
import { IAccount } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CustomerAccountsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class CustomerAccountsEffects {
  constructor(
    private actions$: Actions<
      CustomerAccountsActions.CustomerAccountsActionsUnion
    >,
    private accountsService: AccountsService,
    private customerAccountsFacade: CustomerAccountsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setCustomerAccountsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.SetCustomerAccountsPage.type),
      map(() => CustomerAccountsActions.LoadCustomerAccounts())
    )
  );

  filterAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.FilterCustomerAccounts.type),
      map(() => CustomerAccountsActions.LoadCustomerAccounts())
    )
  );

  sortAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.SortCustomerAccounts.type),
      map(() => CustomerAccountsActions.LoadCustomerAccounts())
    )
  );

  resetFilerAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.ResetFilterCustomerAccounts.type),
      map(() => CustomerAccountsActions.LoadCustomerAccounts())
    )
  );

  loadCustomerAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.LoadCustomerAccounts.type),
      withLatestFrom(
        this.customerAccountsFacade.accountsConfig$,
        this.authFacade.selectedCorporate,
        this.customerAccountsFacade.filter$
      ),
      switchMap(([_, params, corporate, filter]) => {
        const { uuid } = corporate;
        return this.accountsService
          .getCustomerAccounts(params, uuid, filter)
          .pipe(
            map((data: IAccount.IData) =>
              CustomerAccountsActions.LoadCustomerAccountsSuccess({
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
                CustomerAccountsActions.LoadCustomerAccountsFail({
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

  deleteCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.DeleteCustomerAccount.type),
      map((action) => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.deleteAccount(account).pipe(
          map(() =>
            CustomerAccountsActions.DeleteCustomerAccountSuccess({
              payload: account,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CustomerAccountsActions.DeleteCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleDeleteCustomerAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.DeleteCustomerAccountSuccess.type),
      map((action) => {
        const {
          identity: { fullName },
        } = action.payload;
        this.toggleSnackbar(`${fullName} has been deleted`);
        return action.payload;
      }),
      map(() => CustomerAccountsActions.RedirectToCustomerAccounts())
    )
  );

  handleDeleteCustomerAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.DeleteCustomerAccountFail.type),
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

  activeCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.ActivateCustomerAccount.type),
      map((action) => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.activateAccount(account).pipe(
          map(() =>
            CustomerAccountsActions.ActivateCustomerAccountSuccess({
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
              CustomerAccountsActions.ActivateCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleActivateCustomerAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.ActivateCustomerAccountFail.type),
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

  deactivateCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.DeactivateCustomerAccount.type),
      map((action) => action.payload),
      switchMap((account: IAccount.IDocument) => {
        return this.accountsService.deactivateAccount(account).pipe(
          map(() =>
            CustomerAccountsActions.DeactivateCustomerAccountSuccess({
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
              CustomerAccountsActions.DeactivateCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleDeactivateCustomerAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.DeactivateCustomerAccountFail.type),
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

  getCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.GetCustomerAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.getAccount(payload).pipe(
          map((account) =>
            CustomerAccountsActions.GetCustomerAccountSuccess({
              payload: account,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CustomerAccountsActions.GetCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleGetCustomerAccountFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.GetCustomerAccountFail.type),
      map((action) => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => CustomerAccountsActions.RedirectToCustomerAccounts())
    )
  );

  updateCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.UpdateCustomerAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.updateAccount(payload).pipe(
          map((account) =>
            CustomerAccountsActions.UpdateCustomerAccountSuccess({
              payload: {
                id: account.uuid,
                changes: account,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CustomerAccountsActions.UpdateCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleUpdateCustomerAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.UpdateCustomerAccountFail.type),
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

  handleUpdateCustomerAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.UpdateCustomerAccountSuccess.type),
      map((action) => {
        const { identity } = action.payload.changes;
        this.toggleSnackbar(`${identity.fullName} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/customer'],
          },
        });
      })
    )
  );

  updateCustomerPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.UpdateCustomerPassword.type),
      map((action) => action.payload),
      switchMap((payload: IAccount.IUpdatePass) => {
        return this.accountsService.updateAccountPassword(payload).pipe(
          map((account) =>
            CustomerAccountsActions.UpdateCustomerPasswordSuccess({
              payload: account,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CustomerAccountsActions.UpdateCustomerPasswordFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleUpdateCustomerPasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.UpdateCustomerPasswordSuccess.type),
      map((action) => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} password has been updated.`);
        return action.payload;
      }),
      map(() => CustomerAccountsActions.RedirectToCustomerAccounts())
    )
  );

  handleUpdateCustomerPasswordFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.UpdateCustomerPasswordFail.type),
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
      ofType(CustomerAccountsActions.RedirectToCustomerAccounts.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/customer'],
          },
        });
      })
    )
  );

  resyncCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.ResyncCustomerAccount.type),
      map((action) => action.payload),
      switchMap((payload: IAccount.IDocument) => {
        return this.accountsService.resyncAccount(payload).pipe(
          map((account) =>
            CustomerAccountsActions.ResyncCustomerAccountSuccess({
              payload: account,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CustomerAccountsActions.ResyncCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleResyncCustomerAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.ResyncCustomerAccountSuccess.type),
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

  handleResyncCustomerAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.ResyncCustomerAccountFail.type),
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

  createCustomerAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.CreateCustomerAccount.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.accountsService.createAccount(payload).pipe(
          map((account) =>
            CustomerAccountsActions.CreateCustomerAccountSuccess({
              payload: account,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CustomerAccountsActions.CreateCustomerAccountFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleCreateCustomerAccountSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomerAccountsActions.CreateCustomerAccountSuccess.type),
      map((action) => {
        const { identity } = action.payload;
        this.toggleSnackbar(`${identity.fullName} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/customer'],
          },
        });
      })
    )
  );

  handleCreateCustomerAccountFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CustomerAccountsActions.CreateCustomerAccountFail.type),
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
