import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { RolesActions } from '../actions';

// Services
import { RolesService } from '../../services';

// Models
import { IRole } from '../../models';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  tap,
  debounceTime,
  withLatestFrom
} from 'rxjs/operators';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facade
import { AuthFacade } from '@neural/auth';

@Injectable()
export class RolesEffects {
  constructor(
    private actions$: Actions<RolesActions.RolesActionsUnion>,
    private rolesService: RolesService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.LoadRoles.type),
      switchMap(() => {
        return this.rolesService.getRoles().pipe(
          map((roles: IRole.IDocument[]) =>
            RolesActions.LoadRolesSuccess({ payload: roles })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(RolesActions.LoadRolesFail({ payload: message }));
          })
        );
      })
    )
  );

  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.CreateRole.type),
      map(action => action.payload),
      withLatestFrom(this.authFacade.account$),
      switchMap(([payload, account]) => {
        const isSuperAdmin =
          account && account.isSuperAdmin ? account.isSuperAdmin : false;
        return this.rolesService.createRole(payload, isSuperAdmin).pipe(
          map((role: IRole.IDocument) =>
            RolesActions.CreateRoleSuccess({ payload: role })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(RolesActions.CreateRoleFail({ payload: message }));
          })
        );
      })
    )
  );

  getRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.GetRole.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.rolesService.getRole(payload).pipe(
          map((data: IRole.IDocument) =>
            RolesActions.GetRoleSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              RolesActions.GetRoleFail({
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

  handleGetRoleFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.GetRoleFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => RolesActions.RedirectToRoles())
      )
  );

  handleRedirectToRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.RedirectToRoles.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/roles'],
          },
        });
      })
    )
  );

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.UpdateRole.type),
      map(action => action.payload),
      withLatestFrom(this.authFacade.account$),
      switchMap(([payload, account]) => {
        const isSuperAdmin =
          account && account.isSuperAdmin ? account.isSuperAdmin : false;

        return this.rolesService.updateRole(payload, isSuperAdmin).pipe(
          map((role: IRole.IDocument) =>
            RolesActions.UpdateRoleSuccess({
              payload: {
                id: role.uuid,
                changes: {
                  name: role.name,
                  permissions: role.permissions
                }
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(RolesActions.UpdateRoleFail({ payload: message }));
          })
        );
      })
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.DeleteRole.type),
      map(action => action.payload),
      switchMap((payload: IRole.IDocument) => {
        return this.rolesService.deleteRole(payload).pipe(
          map((role: IRole.IDocument) =>
            RolesActions.DeleteRoleSuccess({ payload: role })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(RolesActions.DeleteRoleFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateRoleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.CreateRoleSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created.`);
        return action.payload;
      }),
      debounceTime(1000),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/roles']
          }
        });
      })
    )
  );

  handleUpdateRoleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RolesActions.UpdateRoleSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        return this.toggleSnackbar(`${name} has been updated.`);
      }),
      debounceTime(1000),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/roles']
          }
        });
      })
    )
  );

  handleDeleteRoleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RolesActions.DeleteRoleSuccess.type),
        map(action => {
          const { name } = action.payload;
          return this.toggleSnackbar(`${name} has been deleted.`);
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
