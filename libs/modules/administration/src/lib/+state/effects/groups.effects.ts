import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { GroupsActions } from '../actions';

// Services
import { GroupsService } from '../../services';

// Models
import { IGroup } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { AuthFacade } from '@neural/auth';

@Injectable()
export class GroupsEffects {
  constructor(
    private actions$: Actions<GroupsActions.GroupsActionsUnion>,
    private groupsService: GroupsService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.LoadGroups.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, params]) => {
        const { uuid } = params;
        return this.groupsService.getGroups(uuid).pipe(
          map((groups: IGroup.IDocument[]) =>
            GroupsActions.LoadGroupsSuccess({ payload: groups })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(GroupsActions.LoadGroupsFail({ payload: message }));
          })
        );
      })
    )
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.CreateGroup.type),
      map(action => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const { uuid } = corporate;
        return this.groupsService.createGroup(uuid, payload).pipe(
          map((group: IGroup.IDocument) =>
            GroupsActions.CreateGroupSuccess({ payload: group })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(GroupsActions.CreateGroupFail({ payload: message }));
          })
        );
      })
    )
  );

  getGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.GetGroup.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, selectedCorporate]) => {
        const { uuid } = selectedCorporate;

        return this.groupsService.getGroup(payload, uuid).pipe(
          map((data: IGroup.IDocument) =>
            GroupsActions.GetGroupSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              GroupsActions.GetGroupFail({
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

  handleGetGroupFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupsActions.GetGroupFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        }),
        map(() => GroupsActions.RedirectToGroups())
      )
  );

  handleRedirectToGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.RedirectToGroups.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/groups'],
          },
        });
      })
    )
  );

  updateGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.UpdateGroup.type),
      withLatestFrom(this.authFacade.corporates$),
      switchMap(([_, params]) => {
        const [{ uuid }] = params;
        return this.groupsService.updateGroup(uuid, _.payload).pipe(
          map((group: IGroup.IDocument) =>
            GroupsActions.UpdateGroupSuccess({
              payload: {
                id: group.uuid,
                changes: {
                  name: group.name,
                  roleUuids: group.roleUuids
                }
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(GroupsActions.UpdateGroupFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdateGroupFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupsActions.UpdateGroupFail.type),
        map(action => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );

  deleteGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.DeleteGroup.type),
      map(action => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, params]) => {
        const { uuid } = params;
        return this.groupsService.deleteGroup(payload, uuid).pipe(
          map((group: IGroup.IDocument) =>
            GroupsActions.DeleteGroupSuccess({ payload: group })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(GroupsActions.DeleteGroupFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateGroupSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.CreateGroupSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/groups']
          }
        });
      })
    )
  );

  handleUpdateGroupSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.UpdateGroupSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated.`);
        return action.payload.changes;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/groups']
          }
        });
      })
    )
  );

  handleDeleteGroupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupsActions.DeleteGroupSuccess.type),
        map(action => {
          const { name } = action.payload;
          return this.toggleSnackbar(`${name} has been deleted.`);
        })
      ),
    {
      dispatch: false
    }
  );

  handleDeleteGroupFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupsActions.DeleteGroupFail.type),
        map(action => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
