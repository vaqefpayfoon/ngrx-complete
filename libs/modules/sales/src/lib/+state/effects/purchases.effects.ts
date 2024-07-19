import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { PurchasesActions } from '../actions';

// Services
import { SalesService } from '../../services';

// Models
import { IPurchases } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { PurchasesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { Auth, AuthFacade } from '@neural/auth';

import { AccountsService, ISalesAdvisor } from '@neural/modules/administration';

import { IModels, ModelsService } from '@neural/modules/models';

// Vehicles
import { VehiclesService } from '@neural/modules/customer/vehicles';

@Injectable()
export class PurchasesEffects {
  constructor(
    private actions$: Actions<PurchasesActions.PurchasesActionsUnion>,
    private salesService: SalesService,
    private purchasesFacade: PurchasesFacade,
    private authFacade: AuthFacade,
    private accountsService: AccountsService,
    private snackBar: MatSnackBar,
    private modelsService: ModelsService,
    private vehiclesService: VehiclesService
  ) {}

  setPurchasesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.SetPurchasesPage.type),
      map(() => PurchasesActions.LoadPurchases())
    )
  );

  changePurchasesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.ChangePurchasesPage.type),
      map(() => PurchasesActions.LoadPurchases())
    )
  );

  setPurchasesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.SetPurchasesFilters.type),
      map(() => PurchasesActions.LoadPurchases())
    )
  );

  loadPurchases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.LoadPurchases.type),
      withLatestFrom(
        this.purchasesFacade.purchasesConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.purchasesFacade.getPurchasesFilters$,
        this.purchasesFacade.getPurchasesSorts$,
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
            ['corporate.uuid']: corporate.uuid,
            ['branch.uuid']: branch.uuid,
            ...selectedFilters,
          };

          const sorts = {
            ...selectedSorts,
          };

          if (
            !!account &&
            !!account?.permissions?.operationRole &&
            (account?.permissions?.operationRole === Auth.OperationRole.SA ||
              account?.permissions?.operationRole ===
                Auth.OperationRole.SALES_ADVISOR)
          ) {
            filters = {
              ...filters,
              ['salesAdvisor.uuid']: account.uuid,
            };
          }

          if (!account?.isSuperAdmin) {
            params = {
              ...params,
              corporateUuid: corporate.uuid,
            };
          }

          return this.salesService.getSales(params, filters, sorts).pipe(
            map((data: IPurchases.IData) =>
              PurchasesActions.LoadPurchasesSuccess({
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
                PurchasesActions.LoadPurchasesFail({
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

  getPurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetPurchase.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.getSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchasesActions.GetPurchaseSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetPurchaseFail({
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

  getSalesAdvisor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetSalesAdvisor.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.purchasesFacade.purchase$
      ),
      switchMap(([_, corporate, branch, purchase]) => {
        const corporateUuid = corporate.uuid,
          branchUuid = branch.uuid,
          brand = purchase?.model?.unit?.brand;

        return this.accountsService
          .getSalesAdvisor({
            corporateUuid,
            branchUuid,
            brand,
          })
          .pipe(
            map((data: ISalesAdvisor.ISADocument[]) =>
              PurchasesActions.GetSalesAdvisorSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                PurchasesActions.GetSalesAdvisorFail({
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

  completePurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.CompletePurchase.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.completeSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchasesActions.CompletePurchaseSuccess({
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
              PurchasesActions.CompletePurchaseFail({
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

  handleGetPurchaseFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetPurchaseFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => PurchasesActions.RedirectToSales())
    )
  );

  handleCompletePurchaseSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.CompletePurchaseSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been completed.`);
        })
      ),
    { dispatch: false }
  );

  handleCancelPurchaseFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.CancelPurchaseFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  cancelPurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.CancelPurchase.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.cancelSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchasesActions.CancelPurchaseSuccess({
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
              PurchasesActions.CancelPurchaseFail({
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

  handleCancelPurchaseSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.CancelPurchaseSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been cancelled.`);
        })
      ),
    { dispatch: false }
  );

  updatePurchase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.UpdatePurchase.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.updateSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchasesActions.UpdatePurchaseSuccess({
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
              PurchasesActions.UpdatePurchaseFail({
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

  handleUpdatePurchaseSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.UpdatePurchaseSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been updated.`);
        })
      ),
    { dispatch: false }
  );

  handleUpdatePurchaseFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.UpdatePurchaseFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  handleRedirectToSales$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.RedirectToSales.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/sales/purchases'],
          },
        });
      })
    )
  );

  getBrandsAndSeries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetBrandsAndSeries.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const { uuid } = corporate;
        return this.modelsService.listBrandsAndSeries(uuid).pipe(
          map((brandsAndSeries: IModels.IBrand[]) => {
            return PurchasesActions.GetBrandsAndSeriesSuccess({
              payload: brandsAndSeries,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetBrandsAndSeriesFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  getSeriesModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetSeriesModels.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const { uuid } = corporate;
        const { brand, series } = payload;
        return this.modelsService.listSeriesModels(uuid, brand, series).pipe(
          map((res: IModels.ISeries) => {
            return PurchasesActions.GetSeriesModelsSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetSeriesModelsFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  getVariants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetVariants.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const data: IModels.IVariant = {
          ...payload,
          corporateUuid: corporate.uuid,
        };
        return this.modelsService.listVariants(data).pipe(
          map((res: IModels.IDocument[]) => {
            return PurchasesActions.GetVariantsSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetVariantsFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  clearSaleBadge$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.ClearSaleBadge.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.clearSaleBadge(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchasesActions.ClearSaleBadgeSuccess({
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
              PurchasesActions.ClearSaleBadgeFail({
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

  handleClearSaleBadgeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.ClearSaleBadgeSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been updated.`);
        })
      ),
    { dispatch: false }
  );

  handleClearSaleBadgeFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.ClearSaleBadgeFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  clearAllSaleBadges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.ClearAllSaleBadges.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.salesService.clearAllSaleBadges(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchasesActions.ClearAllSaleBadgesSuccess({
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
              PurchasesActions.ClearAllSaleBadgesFail({
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

  handleClearAllSaleBadgesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.ClearAllSaleBadgesSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been updated.`);
        })
      ),
    { dispatch: false }
  );

  handleClearAllSaleBadgesFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.ClearAllSaleBadgesFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  getGlobalBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetGlobalBrands.type),
      switchMap(() => {
        return this.vehiclesService.getGlobalVehicleBrands().pipe(
          map((brands: string[]) => {
            return PurchasesActions.GetGlobalBrandsSuccess({
              payload: brands,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetGlobalBrandsFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  getGlobalModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetGlobalModels.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { brand } = payload;
        return this.vehiclesService.getGlobalVehicleModels(brand).pipe(
          map((models: string[]) => {
            return PurchasesActions.GetGlobalModelsSuccess({
              payload: models,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetGlobalModelsFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  getGlobalVariants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.GetGlobalVariants.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { brand, model } = payload;
        return this.vehiclesService.getGlobalVehicleVariants(brand, model).pipe(
          map((variants: string[]) => {
            return PurchasesActions.GetGlobalVariantsSuccess({
              payload: variants,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchasesActions.GetGlobalVariantsFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  updateSaleFulfillment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchasesActions.UpdatePurchaseFulfillment.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const updatedDocument: {
          saleUuid: string;
          fullFillment: IPurchases.ISaleFulfillment;
        } = {
          saleUuid: payload.uuid,
          fullFillment: payload.fullFillment,
        };
        return this.salesService
          .updatePurchaseFulfillment(updatedDocument)
          .pipe(
            map((data: IPurchases.ISaleFulfillment[]) =>
              PurchasesActions.UpdatePurchaseFulfillmentSuccess({
                payload: {
                  id: payload.uuid,
                  changes: {
                    fulfillments: data,
                  },
                },
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                PurchasesActions.UpdatePurchaseFulfillmentFail({
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

  handleUpdatePurchaseFulfillmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.UpdatePurchaseFulfillmentSuccess.type),
        withLatestFrom(this.purchasesFacade.purchase$),
        map(([_, selectedPurchase]) => {
          const { referenceNumber } = selectedPurchase;
          return this.toggleSnackbar(
            `${referenceNumber}'s fulfillment has been updated.`
          );
        })
      ),
    { dispatch: false }
  );

  handleUpdatePurchaseFulfillmentFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchasesActions.UpdatePurchaseFulfillmentFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
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
