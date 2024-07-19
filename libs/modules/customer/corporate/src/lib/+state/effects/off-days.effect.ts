import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OffDaysActions } from '../actions';
import { BranchesService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AuthFacade } from '@neural/auth';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IBranches } from '../../models';
import { of } from 'rxjs';

@Injectable()
export class OffDaysEffects {
  constructor(
    private actions$: Actions<OffDaysActions.OffDaysActionsUnion>,
    private branchesService: BranchesService,
    private snackBar: MatSnackBar,
  ) {}

  loadOffDays$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OffDaysActions.loadOffDaysList.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const config: IBranches.IConfig = {
          limit: 10,
          page: 1,
        };
        return this.branchesService.getSchedulesOffDays(config, payload).pipe(
          map((data: any) => {
            return OffDaysActions.loadOffDaysListSuccess({
              payload: data?.docs,
              pagination: {
                limit: data?.limit,
                page: data?.page,
                pages: data?.pages,
                total: data?.total,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              OffDaysActions.loadOffDaysListFailed({
                payload: {
                  status: res.status,
                  message,
                },
              })
            );
          })
        );
      })
    );
  });

  setOffDaysPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffDaysActions.SetOffDaysListPage.type),
      map((action) => action),
      switchMap((action) => {
        return this.branchesService
          .getSchedulesOffDays(action.payload, action.uuid)
          .pipe(
            map((data: any) => {
              return OffDaysActions.loadOffDaysListSuccess({
                payload: data?.docs,
                pagination: {
                  limit: data?.limit,
                  page: data?.page,
                  pages: data?.pages,
                  total: data?.total,
                },
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                OffDaysActions.loadOffDaysListFailed({
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

  changeOffDaysPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffDaysActions.ChangeOffDaysListPage.type),
      map((action) => action),
      switchMap((action) => {
        return this.branchesService
          .getSchedulesOffDays(action.payload, action.uuid)
          .pipe(
            map((data: any) => {
              return OffDaysActions.loadOffDaysListSuccess({
                payload: data?.docs,
                pagination: {
                  limit: data?.limit,
                  page: data?.page,
                  pages: data?.pages,
                  total: data?.total,
                },
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                OffDaysActions.loadOffDaysListFailed({
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
}
