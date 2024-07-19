import { Injectable } from '@angular/core';
import { AuthFacade } from '@neural/auth';
import * as fromRoot from '@neural/ngrx-router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IServiceLine } from '../../models';
import { ServiceLineService } from '../../services/service-line.service';
import { ServiceLineAction } from '../actions';
import { ServiceLineFacade } from '../facades/service-line.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
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
        this.serviceLineFacade.getServiceLineConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.serviceLineFacade.getServiceLineFilters$,
        this.serviceLineFacade.getServiceLineSorts$,
        this.authFacade.account$
      ),
      switchMap(
        ([
          _,
          params,
          corporate,
          branch,
          selectedFilters,
          selectedSorts,
          account,
        ]) => {
          let filters = {
            ...selectedFilters,
          };

          const sorts = {
            ...selectedSorts,
          };

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
  getServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.GetServiceLine.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService.getServiceLine(payload).pipe(
          map((data: IServiceLine.IDocument) =>
            ServiceLineAction.GetServiceLineSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceLineAction.GetServiceLineFail({
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
  getServiceTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.GetServiceTypes.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const uuid: string = corporate.uuid;
        return this.serviceLineService.getServiceType(uuid).pipe(
          map((payload: IServiceLine.IServiceType) =>
            ServiceLineAction.GetServiceTypesSuccess({ payload })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceLineAction.GetServiceTypesFail({ payload: message })
            );
          })
        );
      })
    )
  );
  handleGetServiceLineFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.GetServiceLineFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => ServiceLineAction.RedirectToServiceLine())
    )
  );
  createServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.CreateServiceLine.type),
      map((action) => action.payload),
      switchMap((payload: IServiceLine.IDocument) => {
        return this.serviceLineService.createServiceLine(payload).pipe(
          map((payload: IServiceLine.IDocument) => {
            return ServiceLineAction.CreateServiceLineSuccess({
              payload,
            });
          }),
          catchError((res: any) => {
            const message = res.error.response.message;
            return of(
              ServiceLineAction.CreateServiceLineFail({ payload: message })
            );
          })
        );
      })
    )
  );
  updateServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.UpdateServiceLine.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService.updateServiceLine(payload).pipe(
          map((data) => {
            return ServiceLineAction.UpdateServiceLineSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceLineAction.UpdateServiceLineFail({
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
  changeStatusServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.ChangeStatusServiceLine.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService.changeStatusServiceLine(payload).pipe(
          map((data) => {
            return ServiceLineAction.ChangeStatusServiceLineSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceLineAction.ChangeStatusServiceLineFail({
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
  handleServiceLineFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.CreateServiceLineFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );
  handleUpdateServiceLineSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.UpdateServiceLineSuccess.type),
        map((action) => {
          this.toggleSnackbar(`Service successfully updated`);
          return action.payload;
        }),
        map(() => ServiceLineAction.RedirectToServiceLine())
      )
    // { dispatch: false }
  );
  handleChangeStatusServiceLineSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.ChangeStatusServiceLineSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Service successfully updated`);
        return action.payload;
      }),
      map(() => ServiceLineAction.loadServiceLines())
    )
  );

  handleChangeStatusServiceLineFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.ChangeStatusServiceLineFail.type),
      map((action) => {
        this.toggleSnackbar(action.payload?.message);
      }),
      map(() => ServiceLineAction.loadServiceLines())
    )
  );

  handleCreateServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.CreateServiceLineSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Service has been created.`);
        return action.payload;
      }),
      map(() => ServiceLineAction.RedirectToServiceLine())
    )
  );
  handleCreateServiceLineFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.CreateServiceLineFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );
  handleUpdateServiceLineFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.UpdateServiceLineFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );
  handleRedirectToServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.RedirectToServiceLine.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/service-menu/service-line/list'],
          },
        });
      })
    )
  );
  getBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.GetBrands.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, selectedCorporate]) => {
        return this.serviceLineService
          .getBrandModelList(selectedCorporate.uuid)
          .pipe(
            map((data) =>
              ServiceLineAction.GetBrandsSuccess({
                payload: data,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;

              return of(
                ServiceLineAction.GetBrandsFail({
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
  handleGetBrandsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.GetBrandsFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );
  loadCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.LoadCorporate.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const uuid: string = corporate.uuid;
        return this.serviceLineService.getCorporate(uuid).pipe(
          map((payload: ICorporates.IDocument) =>
            ServiceLineAction.LoadCorporateSuccess({ payload })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServiceLineAction.LoadCorporateFail({ payload: message })
            );
          })
        );
      })
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

  SyncServiceLineDMS$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.SyncServiceLineDMS.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, selectedCorporate, selectedBranch]) => {
        return this.serviceLineService
          .synchServiceLineKaito(selectedCorporate.uuid, selectedBranch.uuid)
          .pipe(
            map((data) =>
              ServiceLineAction.SyncServiceLineDMSSuccess({
                payload: data,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;

              return of(
                ServiceLineAction.SyncServiceLineDMSFail({
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

  handleSyncServiceLineDMSSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.SyncServiceLineDMSSuccess.type),
        map((action) => {
          this.toggleSnackbar(action.payload);
        })
      ),
    { dispatch: false }
  );

  handleSyncServiceLineDMSFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.SyncServiceLineDMSFail.type),
        map((action) => {
          this.toggleSnackbar(action.payload?.message);
        })
      ),
    { dispatch: false }
  );

  GetForetelist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServiceLineAction.GetFortellis.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService
          .getKaitoServiceLineByOperationCode(
            payload.corporateUuid,
            payload.branchUuid,
            payload.operationCode
          )
          .pipe(
            map((data) =>
              ServiceLineAction.GetFortellisSuccess({
                payload: data,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;

              return of(
                ServiceLineAction.GetFortellisFail({
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

  handleGetForetelistFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServiceLineAction.GetFortellisFail.type),
        map((action) => {
          this.toggleSnackbar(action.payload?.message);
        })
      ),
    { dispatch: false }
  );
  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
