import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { InsurerActions } from '../actions';

// Services
import { InsurerService } from '../../services';

// Models
import { IInsurer } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { InsurerFacade } from '../facades';

import { AuthFacade } from '@neural/auth';
import { IGlobalData, IGlobalFilter, IGlobalSort } from '@neural/shared/data';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class InsurerEffects {
  constructor(
    private actions$: Actions<InsurerActions.InsurersActionsUnion>,
    private insurerService: InsurerService,
    private insurerFacade: InsurerFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setInsurersPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.SetInsurersPage.type),
      map(() => InsurerActions.LoadInsurers())
    )
  );

  changeInsurersPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.ChangeInsurersPage.type),
      map(() => InsurerActions.LoadInsurers())
    )
  );

  setInsurersFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.SetInsurersFilters.type),
      map(() => InsurerActions.LoadInsurers())
    )
  );

  loadInsurers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.LoadInsurers.type),
      withLatestFrom(
        this.insurerFacade.corporateUuid$,
        this.insurerFacade.configs$,
        this.insurerFacade.filters$,
        this.insurerFacade.sorts$
      ),
      switchMap(
        ([_, corporateUuid, config, selectedFilters, selectedSorts]) => {
          const filters: IGlobalFilter = {
            ...selectedFilters,
            corporateUuid: corporateUuid,
          };

          const sorts: IGlobalSort = {
            ...selectedSorts,
          };

          return this.insurerService
            .getInsurers({ corporateUuid, config, filters, sorts })
            .pipe(
              map((data: IGlobalData<IInsurer.IDocument>) =>
                InsurerActions.LoadInsurersSuccess({
                  insurers: data.docs,
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
                  InsurerActions.LoadInsurersFail({
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

  createInsurer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.CreateInsurer.type),
      map((action) => action),
      switchMap((payload) => {
        return this.insurerService.createInsurer(payload).pipe(
          map((data: IInsurer.IDocument) =>
            InsurerActions.CreateInsurerSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InsurerActions.CreateInsurerFail({
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

  handleCreateInsurerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.CreateInsurerSuccess.type),
      map((action) => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} have been created.`);
        return action.payload;
      }),
      map((payload) => InsurerActions.RedirectToInsurers({ payload }))
    )
  );

  handleCreateInsurerFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InsurerActions.CreateInsurerFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  updateInsurer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.UpdateInsurer.type),
      switchMap((payload) => {
        return this.insurerService.updateInsurer(payload).pipe(
          map((data: IInsurer.IDocument) =>
            InsurerActions.UpdateInsurerSuccess({
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
              InsurerActions.UpdateInsurerFail({
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

  handleUpdateInsurerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.UpdateInsurerSuccess.type),
      map((action) => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} have been updated.`);
        return action.payload.changes;
      }),
      map((payload) => InsurerActions.RedirectToInsurers({ payload }))
    )
  );

  handleUpdateInsurerFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InsurerActions.UpdateInsurerFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  activeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.ActivateInsurer.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.insurerService.activateInsurer({ payload }).pipe(
          map((insurer) =>
            InsurerActions.ActivateInsurersSuccess({
              payload: {
                id: insurer.uuid,
                changes: {
                  active: !insurer.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InsurerActions.ActivateInsurerFail({
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

  deactivateInsurer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.DeactivateInsurer.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.insurerService.deactivateInsurer({ payload }).pipe(
          map((insurer) =>
            InsurerActions.ActivateInsurersSuccess({
              payload: {
                id: insurer.uuid,
                changes: {
                  active: !insurer.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InsurerActions.DeactivateInsurerFail({
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

  deleteInsurer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.DeleteInsurer.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.insurerService.deleteInsurer({ payload }).pipe(
          map((insurer) =>
            InsurerActions.DeleteInsurerSuccess({
              payload: insurer,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InsurerActions.DeleteInsurerFail({
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

  handleStatusInsurerFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          InsurerActions.ActivateInsurerFail.type,
          InsurerActions.DeactivateInsurerFail.type,
          InsurerActions.DeleteInsurerFail.type
        ),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    {
      dispatch: false,
    }
  );

  handleRedirectToSales$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsurerActions.RedirectToInsurers.type),
      map((action) => {
        const { corporateUuid } = action.payload;
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/customer/corporates/insurers/${corporateUuid}`],
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
