import { Injectable } from '@angular/core';
import { AuthFacade } from '@neural/auth';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IServiceLine } from '../../models';
import { ServiceLineService } from '../../services/service-line.service';
import { ServiceLineAction } from '../actions';
import { ServiceLineFacade } from '../facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IBranches } from '@neural/modules/customer/corporate';
import { BranchesService } from 'libs/modules/customer/corporate/src/lib/services';

@Injectable()
export class ServiceLineEffect {
  constructor(
    private actions$: Actions<ServiceLineAction.ServiceLineActionsUnion>,
    private serviceLineService: ServiceLineService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
    private serviceLineFacade: ServiceLineFacade,
    private branchesService: BranchesService
  ) {}

  loadServiceLine$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ServiceLineAction.loadServiceLines.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.serviceLineFacade.getServiceLineSorts$,
        this.authFacade.account$
      ),
      switchMap(
        ([
          _,
          corporate,
          branch,
          selectedSorts,
          account,
        ]) => {
          let filters = {
            active: true
          };

          const sorts = {
            ...selectedSorts,
          };
          const params: IServiceLine.IConfig = {
            limit: 2000,
            page: 1,
          }
          return this.serviceLineService
            .getServiceLines(
              corporate.uuid,
              branch.uuid,
              params,
              filters,
              sorts
            )
            .pipe(
              map((data: IServiceLine.IData) => {
                return ServiceLineAction.loadServiceLinesSuccess({
                  serviceLines: data.docs,
                  pagination: {
                    limit: data.limit,
                    page: data.page,
                    pages: data.pages,
                    total: data.total,
                  },
                });
              }),
              catchError((res: any) => {
                const message =
                  res.status !== 401 ? res.error.response.message : null;
                return of(
                  ServiceLineAction.loadServiceLinesFailed({
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
  setServiceLinePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.SetServiceLinePage.type),
      map(() => ServiceLineAction.loadServiceLines())
    )
  );
  changeServiceLinePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.ChangeServiceLinePage.type),
      map(() => ServiceLineAction.loadServiceLines())
    )
  );
  setServiceLineFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.SetServiceLineFilters.type),
      map(() => ServiceLineAction.loadServiceLines())
    )
  );

  getBranch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.GetBranch.type),
        map((action) => action.payload),
        switchMap((payload) => {
          return this.branchesService.getBranch(payload).pipe(
            map((branch: IBranches.IDocument) =>
              ServiceLineAction.GetBranchSuccess({
                payload: branch,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(ServiceLineAction.GetBranchFail({ payload: message }));
            })
          );
        })
      ),
    { dispatch: true }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
