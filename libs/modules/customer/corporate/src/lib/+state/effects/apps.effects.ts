import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { AppsActions } from '../actions';

// Services
import { AppsService } from '../../services';

// Models
import { IApps } from '../../models';

// Facades
import { AppsFacade } from '../facades';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom,
  concatMap
} from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

// Dialog Component
import { CorporateAppTokenDialogComponent } from '../../components';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class AppsEffects {
  constructor(
    private actions$: Actions<AppsActions.CorporateAppsActionsUnion>,
    private appsService: AppsService,
    private appsFacade: AppsFacade,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  setCorporatesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.SetCorporateAppsPage.type),
      map(() => AppsActions.LoadCorporateApps())
    )
  );

  loadCorporateApps$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.LoadCorporateApps.type),
      withLatestFrom(this.appsFacade.corporateAppsConfig$),
      switchMap(([_, params]) => {
        return this.appsService.listCorporateApps(params).pipe(
          map((data: IApps.IDocument[]) =>
            AppsActions.LoadCorporateAppsSuccess({
              payload: data
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AppsActions.LoadCorporateAppsFail({ payload: message }));
          })
        );
      })
    )
  );

  loadCorporateApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.LoadCorporateApp.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.appsService.getApp(payload).pipe(
          map((app: IApps.IDocument) =>
            AppsActions.LoadCorporateAppSuccess({
              payload: app
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AppsActions.LoadCorporateAppFail({ payload: message }));
          })
        );
      })
    )
  );

  handleLoadCorporateAppFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.LoadCorporateAppFail.type),
        map((action) => {
          const { payload } = action;
          return this.toggleSnackbar(payload);
        }),
        map(() => AppsActions.RedirectToCorporates())
      )
  );

  handleRedirectToCorporates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.RedirectToCorporates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/corporates'],
          },
        });
      })
    )
  );

  createCorporateAppcreateCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.CreateCorporateApp.type),
      map(action => action.payload),
      switchMap((payload: IApps.ICreate) => {
        return this.appsService.createCorporateApp(payload).pipe(
          concatMap(({ corporateApp, appKey }: IApps.ICreateResponse) => {
            return [
              AppsActions.CreateCorporateAppSuccess({
                payload: { corporateApp, token: appKey }
              })
            ];
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AppsActions.CreateCorporateAppFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateCorporateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.CreateCorporateAppSuccess.type),
      map(action => {
        const { token, corporateApp } = action.payload;
        this.toggleDialog({ token, corporateApp });
        return action.payload.corporateApp;
      }),
      map(corporateApp => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/customer/corporates/${corporateApp.corporateUuid}/app`]
          }
        });
      })
    )
  );

  updateCorporateApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.UpdateCorporateApp.type),
      map(action => action.payload),
      switchMap((payload: IApps.IDocument) => {
        return this.appsService.updateCorporateApp(payload).pipe(
          map((app: IApps.IDocument) => {
            return AppsActions.UpdateCorporateAppSuccess({
              payload: {
                id: app.uuid,
                changes: app
              }
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(AppsActions.UpdateCorporateAppFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdateCorporateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.UpdateCorporateAppSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated.`);
        return action.payload.changes;
      }),
      map(payload => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/customer/corporates/${payload.corporateUuid}/app`]
          }
        });
      })
    )
  );

  activateCorporateApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.ActivateCorporateApp.type),
      map(action => action.payload),
      switchMap((corporateApp: IApps.IDocument) => {
        return this.appsService.activateCorporateApp(corporateApp).pipe(
          map(() =>
            AppsActions.ActivateCorporateAppSuccess({
              payload: {
                id: corporateApp.uuid,
                changes: {
                  name: corporateApp.name,
                  active: !corporateApp.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AppsActions.ActivateCorporateAppFail({ payload: message })
            );
          })
        );
      })
    )
  );

  deactivateCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.DeactivateCorporateApp.type),
      map(action => action.payload),
      switchMap((corporateApp: IApps.IDocument) => {
        return this.appsService.deactivateCorporateApp(corporateApp).pipe(
          map(() =>
            AppsActions.DeactivateCorporateAppSuccess({
              payload: {
                id: corporateApp.uuid,
                changes: {
                  name: corporateApp.name,
                  active: !corporateApp.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AppsActions.DeactivateCorporateAppFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleActivateCorporateAppSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.ActivateCorporateAppSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateCorporateAppSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.DeactivateCorporateAppSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateCorporateAppFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.ActivateCorporateAppFail.type),
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

  handleDeactivateCorporateAppFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.DeactivateCorporateAppFail.type),
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

  regenerateCorporateAppToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppsActions.RegenerateCorporateAppToken.type),
      map(action => action.payload),
      switchMap((corporateApp: IApps.IDocument) => {
        return this.appsService.regenerateCorporateAppToken(corporateApp).pipe(
          map((token: string) =>
            AppsActions.RegenerateCorporateAppTokenSuccess({
              payload: {
                corporateApp,
                token
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AppsActions.RegenerateCorporateAppTokenFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleRegenerateCorporateAppTokenFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.RegenerateCorporateAppTokenFail.type),
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

  handleRegenerateCorporateAppTokenSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppsActions.RegenerateCorporateAppTokenSuccess.type),
        map(action => {
          const { token, corporateApp } = action.payload;
          this.toggleDialog({ token, corporateApp });
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  toggleDialog({
    token,
    corporateApp
  }: {
    token: string;
    corporateApp: IApps.IDocument;
  }) {
    this.dialog
      .open(CorporateAppTokenDialogComponent, {
        data: { token, corporateApp },
        disableClose: true
      })
      .afterClosed()
      .subscribe(() => this.appsFacade.resetToken());
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
