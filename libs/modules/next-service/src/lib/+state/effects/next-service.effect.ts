import { Injectable } from '@angular/core';
import { AuthFacade } from '@neural/auth';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { INextService } from '../../models';
import { NextService } from '../../services/next-service.service';
import { NextServiceAction } from '../actions';

import { NextServiceFacade } from '../facades/next-service.facade';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NextServiceEffects {
  constructor(
    private actions$: Actions<NextServiceAction.NextServiceActionsUnion>,
    private nextService: NextService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
    private nextServiceFacade: NextServiceFacade
  ) {}

  loadNextService$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NextServiceAction.loadNextServices.type),
      withLatestFrom(
        this.nextServiceFacade.getNextServiceConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.nextServiceFacade.getNextServiceFilters$,
        this.nextServiceFacade.getNextServiceSorts$,
      ),
      switchMap(
        ([
          _,
          params,
          corporate,
          branch,
          selectedFilters,
          selectedSorts,
        ]) => {
          let filters = {
            ...selectedFilters,
            ['corporate.uuid']: corporate.uuid,
            ['branch.uuid']: branch.uuid,
          };

          const sorts = {
            ...selectedSorts,
          };

          return this.nextService.getNextService(params, filters, sorts).pipe(
            map((data: INextService.ITotal) => {
              return NextServiceAction.loadNextServicesSuccess({
                data: data,
                pagination: {
                  limit: data.reservations.limit,
                  page: data.reservations.page,
                  pages: data.reservations.pages,
                  total: data.reservations.total,
                },
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                NextServiceAction.loadNextServicesFailed({
                  payload: {
                    status: res.status,
                    message,
                  },
                })
              );
            })
          );
        }
      )
    );
  });
  setNextServicePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NextServiceAction.SetNextServicesPage.type),
      map(() => NextServiceAction.loadNextServices())
    )
  );
  changeNextServicePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NextServiceAction.ChangeNextServicesPage.type),
      map(() => NextServiceAction.loadNextServices())
    )
  );
  setNextServiceFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NextServiceAction.SetNextServicesFilters.type),
      map(() => NextServiceAction.loadNextServices())
    )
  );
  handleGetNextServiceFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NextServiceAction.loadNextServicesFailed.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => NextServiceAction.RedirectToNextService())
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
