import { Injectable } from '@angular/core';
import { AuthFacade } from '@neural/auth';
import * as fromRoot from '@neural/ngrx-router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { IServiceLine, IServicePackage } from '../../models';
import { ServiceLineService } from '../../services/service-line.service';
import { ServicePackageAction } from '../actions';
import { ServicePackageFacade } from '../facades/service-package.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { BranchesService } from 'libs/modules/customer/corporate/src/lib/services';

@Injectable()
export class ServicePackageEffect {
  constructor(
    private actions$: Actions<ServicePackageAction.ServicePackageActionsUnion>,
    private serviceLineService: ServiceLineService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
    private servicePackageFacade: ServicePackageFacade,
    private branchesService: BranchesService
  ) {}

  loadServicePackage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ServicePackageAction.loadServicePackages.type),
      withLatestFrom(
        this.servicePackageFacade.getServicePackageConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.servicePackageFacade.getServicePackageFilters$,
        this.servicePackageFacade.getServicePackageSorts$,
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
            .getServicePackages(
              corporate.uuid,
              branch.uuid,
              params,
              filters,
              sorts
            )
            .pipe(
              map((data: IServicePackage.IData) => {
                return ServicePackageAction.loadServicePackagesSuccess({
                  servicePackages: data.docs,
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
                  ServicePackageAction.loadServicePackagesFailed({
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

  setServicePackagePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.SetServicePackagePage.type),
      map(() => ServicePackageAction.loadServicePackages())
    )
  );

  changeServicePackagePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.ChangeServicePackagePage.type),
      map(() => ServicePackageAction.loadServicePackages())
    )
  );

  setServicePackageFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.SetServicePackageFilters.type),
      map(() => ServicePackageAction.loadServicePackages())
    )
  );
  
  getServicePackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.GetServicePackage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService.getServicePackage(payload).pipe(
          map((data: IServicePackage.IDocument) =>
            ServicePackageAction.GetServicePackageSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServicePackageAction.GetServicePackageFail({
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

  handleGetServicePackageFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.GetServicePackageFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => ServicePackageAction.RedirectToServicePackage())
    )
  );
  createServicePackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.CreateServicePackage.type),
      map((action) => action.payload),
      switchMap((payload: IServicePackage.IDocument) => {
        return this.serviceLineService.createServicePackage(payload).pipe(
          map((payload: IServicePackage.IDocument) => {
            return ServicePackageAction.CreateServicePackageSuccess({
              payload,
            });
          }),
          catchError((res: any) => {
            const message = res.error.response.message;
            return of(
              ServicePackageAction.CreateServicePackageFail({ payload: message })
            );
          })
        );
      })
    )
  );
  updateServicePackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.UpdateServicePackage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService.updateServicePackage(payload).pipe(
          map((data) => {
            return ServicePackageAction.UpdateServicePackageSuccess({
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
              ServicePackageAction.UpdateServicePackageFail({
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
  changeStatusServicePackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.ChangeStatusServicePackage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.serviceLineService.changeStatusServicePackage(payload).pipe(
          map((data) => {
            return ServicePackageAction.ChangeStatusServicePackageSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error?.response?.message : null;
            return of(
              ServicePackageAction.ChangeStatusServicePackageFail({
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
  handleServicePackageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.CreateServicePackageFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );
  handleUpdateServicePackageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.UpdateServicePackageSuccess.type),
        map((action) => {
          this.toggleSnackbar(`Service Package successfully updated`);
          return action.payload;
        }),
        map(() => ServicePackageAction.RedirectToServicePackage())
      )
    // { dispatch: false }
  );
  handleChangeStatusServicePackageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.ChangeStatusServicePackageSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Service Package successfully updated`);
      }),
      // map(() => ServicePackageAction.RedirectToServicePackage())
      map(() => ServicePackageAction.loadServicePackages())
    )
  );

  handleChangeStatusServicePackageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.ChangeStatusServicePackageFail.type),
        map((action) => {
          this.toggleSnackbar(action.payload?.message);
        }),
        map(() => ServicePackageAction.loadServicePackages())
      )
  );

  handleCreateServicePackage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.CreateServicePackageSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Service Package has been created.`);
        return action.payload;
      }),
      map(() => ServicePackageAction.RedirectToServicePackage())
    )
  );
  handleCreateServicePackageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.CreateServicePackageFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );
  handleUpdateServicePackageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.UpdateServicePackageFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );
  handleRedirectToServiceLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.RedirectToServicePackage.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/service-menu/service-package/list'],
          },
        });
      })
    )
  );
  getBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicePackageAction.GetBrands.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, selectedCorporate]) => {
        return this.serviceLineService
          .getBrandModelList(selectedCorporate.uuid)
          .pipe(
            map((data) =>
              ServicePackageAction.GetBrandsSuccess({
                payload: data,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;

              return of(
                ServicePackageAction.GetBrandsFail({
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

  loadServiceLine$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ServicePackageAction.loadServiceLines.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.servicePackageFacade.getServicePackageFilters$,
        this.servicePackageFacade.getServicePackageSorts$
      ),
      switchMap(
        ([
          _,
          corporate,
          branch,
          selectedFilters,
          selectedSorts,
        ]) => {
          let filters = {};

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
                return ServicePackageAction.loadServiceLinesSuccess({
                  payload: data.docs,
                });
              }),
              catchError((res: any) => {
                const message =
                  res.status !== 401 ? res.error.response.message : null;
                return of(
                  ServicePackageAction.loadServiceLinesFailed({
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
  handleGetBrandsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.GetBrandsFail.type),
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
      ofType(ServicePackageAction.LoadCorporate.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const uuid: string = corporate.uuid;
        return this.serviceLineService.getCorporate(uuid).pipe(
          map((payload: ICorporates.IDocument) =>
            ServicePackageAction.LoadCorporateSuccess({ payload })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServicePackageAction.LoadCorporateFail({ payload: message })
            );
          })
        );
      })
    )
  );
  getBranch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicePackageAction.GetBranch.type),
        map((action) => action.payload),
        switchMap((payload) => {
          return this.branchesService.getBranch(payload).pipe(
            map((branch: IBranches.IDocument) =>
              ServicePackageAction.GetBranchSuccess({
                payload: branch,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(ServicePackageAction.GetBranchFail({ payload: message }));
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
