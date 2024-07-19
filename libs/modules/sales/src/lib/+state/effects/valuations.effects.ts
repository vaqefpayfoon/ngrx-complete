import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ValuationsActions } from '../actions';

// Services
import { SalesService } from '../../services';

// Models
import { IPurchases } from '../../models';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { ValuationsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class ValuationsEffects {
  constructor(
    private actions$: Actions<ValuationsActions.ValuationsActionsUnion>,
    private salesService: SalesService,
    private valuationsFacade: ValuationsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setValuationsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.SetValuationsPage.type),
      map(() => ValuationsActions.LoadValuations())
    )
  );

  changeValuationsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.ChangeValuationsPage.type),
      map(() => ValuationsActions.LoadValuations())
    )
  );

  setValuationsFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.SetValuationsFilters.type),
      map(() => ValuationsActions.LoadValuations())
    )
  );

  loadValuations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.LoadValuations.type),
      withLatestFrom(
        this.valuationsFacade.valuationsConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.valuationsFacade.getValuationsFilters$,
        this.valuationsFacade.getValuationsSorts$
      ),
      switchMap(
        ([_, params, corporate, branch, selectedFilters, selectedSorts]) => {
          const filters = {
            ['corporate.uuid']: corporate.uuid,
            ['branch.uuid']: branch.uuid,
            ...selectedFilters,
          };

          const sorts = {
            ...selectedSorts,
          };

          return this.salesService.getSales(params, filters, sorts).pipe(
            map((data: IPurchases.IData) =>
              ValuationsActions.LoadValuationsSuccess({
                sales: data.docs,
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
                ValuationsActions.LoadValuationsFail({
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
    )
  );

  getValuation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.GetValuation.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.getSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            ValuationsActions.GetValuationSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ValuationsActions.GetValuationFail({
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

  completeValuation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.CompleteValuation.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.completeSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            ValuationsActions.CompleteValuationSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ValuationsActions.CompleteValuationFail({
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

  handleGetValuationFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.GetValuationFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => ValuationsActions.RedirectToValuations())
    )
  );

  handleCompleteValuationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ValuationsActions.CompleteValuationSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been completed.`);
        })
      ),
    { dispatch: false }
  );

  handleCancelValuationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ValuationsActions.CancelValuationFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  cancelValuation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.CancelValuation.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.cancelSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            ValuationsActions.CancelValuationSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ValuationsActions.CancelValuationFail({
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

  handleCancelValuationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ValuationsActions.CancelValuationSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been cancelled.`);
        })
      ),
    { dispatch: false }
  );

  // updateValuation$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ValuationsActions.UpdateValuation.type),
  //     map((action) => action.payload),
  //     switchMap((payload) => {
  //       return this.salesService.updateSale(payload).pipe(
  //         map((data: ISales.IDocument) =>
  //           ValuationsActions.UpdateValuationSuccess({
  //             payload: {
  //               id: data.uuid,
  //               changes: data,
  //             },
  //           })
  //         ),
  //         catchError((res: any) => {
  //           const message =
  //             res.status !== 401 ? res.error.response.message : null;
  //           return of(
  //             ValuationsActions.UpdateValuationFail({
  //               payload: {
  //                 status: res.status,
  //                 message,
  //               },
  //             })
  //           );
  //         })
  //       );
  //     })
  //   )
  // );

  handleUpdateValuationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.UpdateValuationSuccess.type),
      map((action) => {
        const { referenceNumber } = action.payload.changes;
        return this.toggleSnackbar(`${referenceNumber} has been updated.`);
      }),
      map(() => ValuationsActions.RedirectToValuations())
    )
  );

  handleUpdateValuationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ValuationsActions.UpdateValuationFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  handleRedirectToSales$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ValuationsActions.RedirectToValuations.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/sales/valuations'],
          },
        });
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
