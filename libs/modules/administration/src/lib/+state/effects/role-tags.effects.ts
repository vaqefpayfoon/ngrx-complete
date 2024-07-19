import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { RoleTagsActions } from '../actions';

// Services
import { PermissionsService } from '../../services';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class RoleTagsEffects {
  constructor(
    private actions$: Actions<RoleTagsActions.RoleTagsActionsUnion>,
    private permissionService: PermissionsService,
    private snackBar: MatSnackBar
  ) {}


  loadRoleTags$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RoleTagsActions.LoadRoleTags.type),
    switchMap(() => {
      return this.permissionService.getPermissions().pipe(
        map((permissions: string[]) =>
          RoleTagsActions.LoadRoleTagsSuccess({ payload: permissions })
        ),
        catchError((res: any) => {
          const message =
            res.status !== 401 ? res.error.response.message : null;
          return of(RoleTagsActions.LoadRoleTagsFail({ payload: message }));
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
