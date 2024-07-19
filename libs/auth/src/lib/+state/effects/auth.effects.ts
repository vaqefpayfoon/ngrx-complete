import { Injectable, Inject } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// RxJs
import {
  map,
  switchMap,
  catchError,
  delay,
  withLatestFrom,
  tap,
} from 'rxjs/operators';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

// Auth actions
import { AuthActions } from '../actions';

// Auth service
import { AuthService } from '../../services/auth.service';
import { AuthFacade } from '../facades';

// Auth intrefaces
import { Auth } from '../../models';

// RxJs and opeators
import { of, from, EMPTY } from 'rxjs';

// Add snackbar
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffect {
  constructor(
    @Inject(ENVIRONMENT) private readonly env: Environment,
    private actions$: Actions<AuthActions.AuthActionsUnion>,
    private authService: AuthService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  anonymousToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AnonymousToken.type),
      switchMap(() => {
        return this.authService.signInAnonymously().pipe(
          switchMap((data) => {
            return from(data.user.getIdToken()).pipe(
              map((token) => {
                return AuthActions.AnonymousTokenSuccess({ payload: token });
              })
            );
          })
        );
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Login.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.authService.login(payload).pipe(
          map((auth: Auth.Account) => {
            if (
              auth.account.products &&
              auth.account.products.includes(this.env.identifier)
            ) {
              return AuthActions.ServerAuthenticated({ payload: auth });
            } else {
              return AuthActions.LoginFail({
                payload: {
                  status: 401,
                  message: 'You do not have access to the control panel.',
                },
              });
            }
          }),
          catchError((res) =>
            of(
              AuthActions.LoginFail({
                payload: {
                  status: res.status,
                  message: res.error.response.message,
                },
              })
            )
          )
        );
      })
    )
  );

  loginFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LoginFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return AuthActions.AnonymousToken();
      })
    )
  );

  serverAuthenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.ServerAuthenticated.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.authService
          .loginFirebase(payload.firebase.customToken)
          .pipe(
            switchMap((data) => {
              return from(data.user.getIdToken()).pipe(
                map((token) => {
                  return AuthActions.FirebaseAuthenticated({
                    payload: { token },
                  });
                })
              );
            })
          );
      })
    )
  );

  firebaseAuthenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.FirebaseAuthenticated.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.corporates$),
      switchMap(([payload, corporates]) => {
        return this.authService.getPermissions(payload.token, corporates).pipe(
          map((permissions) => {
            if (!!permissions) {
              return AuthActions.LoadPermission({ payload: permissions });
            }
            return AuthActions.Logout({
              payload: 'You do not have access to the control panel.',
            });
          }),
          catchError((res) => of(AuthActions.Logout({ payload: res })))
        );
      })
    )
  );

  firebaseRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.FirebaseAuthenticated.type),
      delay(5000),
      switchMap(() => [
        AuthActions.LoginSuccess(),
        AuthActions.CheckAccountType(),
      ])
    )
  );

  firebaseReauthenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.FirebaseReauthenticated.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const selectedCorporate = JSON.parse(
          localStorage.getItem(Auth.Storage.SELECTED_CORPORATE)
        );
        return this.authService
          .getPermissions(payload, [selectedCorporate])
          .pipe(
            switchMap((permissions) => {
              if (!!permissions) {
                return [
                  AuthActions.ReLoadPermission({ payload: permissions }),
                  AuthActions.AccountClass(),
                ];
              }
              return [
                AuthActions.Logout({
                  payload: 'You do not have access to the control panel.',
                }),
              ];
            }),
            catchError((res) => of(AuthActions.Logout({ payload: res })))
          );
      })
    )
  );

  checkAccountType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.CheckAccountType.type),
      withLatestFrom(
        this.authFacade.getAuthAccountFull$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, accountClass, selectedBranch]) => {
        const { account, corporates } = accountClass;

        const [firstCorporate] = corporates;
        const [firstBranch] = firstCorporate.branches;
        if (
          !!account.permissions &&
          !!account.permissions.operationRole &&
          (account.permissions.operationRole === Auth.OperationRole.CSO ||
            account.permissions.operationRole ===
              Auth.OperationRole.SERVICE_ADVISOR)
        ) {
          return [
            AuthActions.SelectCorporate({ payload: firstCorporate }),
            AuthActions.SelectBranch({ payload: firstBranch }),
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/app/hub/reservations/in-progress'],
              },
            }),
          ];
        }

        // todo: change SA to SALES_ADVISOR
        if (
          !!account.permissions &&
          !!account.permissions.operationRole &&
          (account.permissions.operationRole === Auth.OperationRole.SA ||
            account.permissions.operationRole ===
              Auth.OperationRole.SALES_ADVISOR)
        ) {
          return [
            AuthActions.SelectCorporate({ payload: firstCorporate }),
            AuthActions.SelectBranch({ payload: firstBranch }),
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/app/hub/sales/purchases'],
              },
            }),
          ];
        }

        const selectedCorporate = JSON.parse(
          localStorage.getItem(Auth.Storage.SELECTED_CORPORATE)
        );

        if (!selectedCorporate && !!corporates) {
          return [
            AuthActions.SelectCorporate({ payload: firstCorporate }),
            AuthActions.SelectBranch({ payload: firstBranch }),
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/app/home/basic'],
              },
            }),
          ];
        }

        return [AuthActions.GetTimeZone({ payload: selectedBranch.uuid })];
      })
    )
  );

  goHomeFromLoginGuard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.GoHomeFromLoginGuard.type),
      map((action) => action.payload),
      map((permissions) => {
        if (
          !!permissions &&
          !!permissions.operationRole &&
          (permissions.operationRole === Auth.OperationRole.CSO ||
            permissions.operationRole === Auth.OperationRole.SERVICE_ADVISOR)
        ) {
          return fromRoot.RouterActions.Go({
            payload: {
              path: ['/app/hub/reservations/in-progress'],
            },
          });
        }

        // todo: change SA to SALES_ADVISOR
        if (
          !!permissions &&
          !!permissions.operationRole &&
          (permissions.operationRole === Auth.OperationRole.SA ||
            permissions.operationRole === Auth.OperationRole.SALES_ADVISOR)
        ) {
          return fromRoot.RouterActions.Go({
            payload: {
              path: ['/app/hub/test-drives'],
            },
          });
        }

        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/home/basic'],
          },
        });
      })
    )
  );

  goHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.GoHome.type),
      withLatestFrom(this.authFacade.account$),
      map(([_, account]) => {
        if (
          !!account.permissions &&
          !!account.permissions.operationRole &&
          (account.permissions.operationRole === Auth.OperationRole.CSO ||
            account.permissions.operationRole ===
              Auth.OperationRole.SERVICE_ADVISOR)
        ) {
          return fromRoot.RouterActions.Go({
            payload: {
              path: ['/app/hub/reservations/in-progress'],
            },
          });
        }

        // todo: change SA to SALES_ADVISOR
        if (
          !!account.permissions &&
          !!account.permissions.operationRole &&
          (account.permissions.operationRole === Auth.OperationRole.SA ||
            account.permissions.operationRole ===
              Auth.OperationRole.SALES_ADVISOR)
        ) {
          return fromRoot.RouterActions.Go({
            payload: {
              path: ['/app/hub/test-drives'],
            },
          });
        }

        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/home/basic'],
          },
        });
      })
    )
  );

  goToProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.GoToProfile.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/profile/general'],
          },
        });
      })
    )
  );

  contactUs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.ContactUs.type),
        tap(() =>
          window.open('https://whiphelp.zendesk.com/')
        )
      ),
    { dispatch: false }
  );

  accountClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AccountClass.type),
      switchMap(() => {
        return this.authService.getSelfProfileNerv().pipe(
          map((payload) => AuthActions.AccountClassSuccess({ payload })),
          catchError((res: any) => {
            const message =
              res?.status !== 401 ? res.error?.response?.message : null;
              if(res?.status === 403){
                this.authService.logout().pipe(
                  map(() =>
                    fromRoot.RouterActions.Go({
                      payload: {
                        path: ['/login'],
                      },
                    })
                  )
                )
              }
            return of(AuthActions.AccountClassFail({ payload: message }));
          })
        );
      })
    )
  );

  updateSelfAccounutProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UpdateSelfAccountProfile.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.authService.updateSelfAccountProfile(payload).pipe(
          map(() => {
            this.toggleSnackbar(`Account Details have been updated.`);
            return AuthActions.UpdateSelfAccountProfileSuccess({ payload });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AuthActions.UpdateSelfAccountProfileFail({ payload: message })
            );
          })
        );
      })
    )
  );

  updateSelfPhone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UpdateSelfPhone.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.authService.updateSelfPhone(payload).pipe(
          map(() => {
            this.toggleSnackbar(`Account phone number has been updated.`);
            return AuthActions.UpdateSelfPhoneSuccess({ payload });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AuthActions.UpdateSelfPhoneFail({ payload: message }));
          })
        );
      })
    )
  );

  updateSelfPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UpdateSelfPassword.type),
      map((action) => action.payload),
      switchMap((payload: string) => {
        return this.authService.updateSelfPassword(payload).pipe(
          map(() => AuthActions.UpdateSelfPasswordSuccess()),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error?.response?.message : null;
            this.toggleSnackbar(message);
            return of(AuthActions.UpdateSelfPasswordFail({ payload: message }));
          })
        );
      })
    )
  );

  hanldeUpdateSelfPasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UpdateSelfPasswordSuccess.type),
      map(() =>
        this.toggleSnackbar(`Password has been updated. Please login again.`)
      ),
      delay(6000),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() =>
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/login'],
              },
            })
          )
        )
      )
    )
  );

  updateSelfImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.UpdateSelfImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.authService.updateSelfImage(payload).pipe(
          map((account: Auth.IAccount) => {
            return AuthActions.UpdateSelfImageSuccess({ payload: account });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AuthActions.UpdateSelfImageFail({ payload: message }));
          })
        );
      })
    )
  );

  hanldeSelfImageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.UpdateSelfImageSuccess.type),
        map(() => this.toggleSnackbar(`Profile image updated.`))
      ),
    { dispatch: false }
  );

  hanldeSelfImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.UpdateSelfImageFail.type),
        map(() => this.toggleSnackbar(`Image update Failed.`))
      ),
    { dispatch: false }
  );

  hanldeSelectBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SelectBranch.type),
      map((action) => action.payload),
      map((payload) => {
        const { uuid } = payload;
        return AuthActions.GetTimeZone({ payload: uuid });
      })
    )
  );

  getTimeZone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.GetTimeZone.type),
      map((action) => action.payload),
      switchMap((uuid) => {
        return this.authService.getTimeZoneByBranch(uuid).pipe(
          map((timeZone) =>
            AuthActions.GetTimeZoneSuccess({ payload: timeZone })
          ),
          catchError((_) => {
            return EMPTY;
          })
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Logout.type),
      map((action) => {
        const message = action.payload;
        return this.toggleSnackbar(message);
      }),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() =>
            fromRoot.RouterActions.Go({
              payload: {
                path: ['/login'],
              },
            })
          )
        )
      )
    )
  );

  hanldeAccountClassSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AccountClassSuccess.type),
      map(() => AuthActions.CheckAccountType())
    )
  );

  getCountriesCallingCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.GetCountriesCallingCodes.type),
      switchMap(() => {
        return this.authService.getCountriesCallingCodes().pipe(
          map((codes: Auth.IPhoneCode[]) =>
            AuthActions.GetCountriesCallingCodesSuccess({ payload: codes })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AuthActions.GetCountriesCallingCodesFail({
                payload: message,
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
      panelClass: ['snackbar--custom'],
    });
  }
}
