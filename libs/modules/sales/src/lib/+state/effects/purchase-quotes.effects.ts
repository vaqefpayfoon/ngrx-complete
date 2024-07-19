import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { PurchaseQuotesActions } from '../actions';

// Services
import { PurchaseQuoteService } from '../../services';

// Models
import { IPurchases } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { PurchaseQuotesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { Auth, AuthFacade } from '@neural/auth';

import { AccountsService, ISalesAdvisor } from '@neural/modules/administration';

import { IModels, ModelsService } from '@neural/modules/models';

// Vehicles
import { VehiclesService } from '@neural/modules/customer/vehicles';

@Injectable()
export class PurchaseQuotesEffects {
  constructor(
    private actions$: Actions<PurchaseQuotesActions.PurchaseQuotesActionsUnion>,
    private purchaseQuoteService: PurchaseQuoteService,
    private purchaseQuotesFacade: PurchaseQuotesFacade,
    private authFacade: AuthFacade,
    private accountsService: AccountsService,
    private snackBar: MatSnackBar,
    private modelsService: ModelsService,
    private vehiclesService: VehiclesService
  ) {}

  setPurchaseQuotesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.SetPurchaseQuotesPage.type),
      map(() => PurchaseQuotesActions.LoadPurchaseQuotes())
    )
  );

  changePurchaseQuotesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.ChangePurchaseQuotesPage.type),
      map(() => PurchaseQuotesActions.LoadPurchaseQuotes())
    )
  );

  setPurchaseQuotesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.SetPurchaseQuotesFilters.type),
      map(() => PurchaseQuotesActions.LoadPurchaseQuotes())
    )
  );

  loadPurchaseQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.LoadPurchaseQuotes.type),
      withLatestFrom(
        this.purchaseQuotesFacade.purchasesConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.purchaseQuotesFacade.getPurchasesFilters$,
        this.purchaseQuotesFacade.getPurchasesSorts$,
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
              ['saleAdvisor.uuid']: account.uuid,
            };
          }

          if (!account?.isSuperAdmin) {
            params = {
              ...params,
              corporateUuid: corporate.uuid,
            };
          }

          return this.purchaseQuoteService
            .getPurchaseQuotes(params, filters, sorts)
            .pipe(
              map((data: IPurchases.IData) =>
                PurchaseQuotesActions.LoadPurchaseQuotesSuccess({
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
                  PurchaseQuotesActions.LoadPurchaseQuotesFail({
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

  getPurchaseQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.GetPurchaseQuote.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.purchaseQuoteService.getSale(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchaseQuotesActions.GetPurchaseQuoteSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetVariantsFail({
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
      ofType(PurchaseQuotesActions.GetSalesAdvisor.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.purchaseQuotesFacade.purchase$
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
              PurchaseQuotesActions.GetSalesAdvisorSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                PurchaseQuotesActions.GetSalesAdvisorFail({
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

  handleGetPurchaseQuoteFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.GetPurchaseQuoteFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => PurchaseQuotesActions.RedirectToPurchaseQuote())
    )
  );

  updatePurchaseQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.UpdatePurchaseQuote.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.purchaseQuoteService.updatePurchaseQuote(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchaseQuotesActions.UpdatePurchaseQuoteSuccess({
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
              PurchaseQuotesActions.UpdatePurchaseQuoteFail({
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

  handleUpdatePurchaseQuoteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchaseQuotesActions.UpdatePurchaseQuoteSuccess.type),
        map((action) => {
          const { referenceNumber } = action.payload.changes;
          return this.toggleSnackbar(`${referenceNumber} has been updated.`);
        })
      ),
    { dispatch: false }
  );

  handleUpdatePurchaseQuoteFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PurchaseQuotesActions.UpdatePurchaseQuoteFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  handleRedirectToPurchaseQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.RedirectToPurchaseQuote.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/sales/purchase-quotes'],
          },
        });
      })
    )
  );

  getBrandsAndSeries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.GetBrandsAndSeries.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const { uuid } = corporate;
        return this.modelsService.listBrandsAndSeries(uuid).pipe(
          map((brandsAndSeries: IModels.IBrand[]) => {
            return PurchaseQuotesActions.GetBrandsAndSeriesSuccess({
              payload: brandsAndSeries,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetBrandsAndSeriesFail({
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
      ofType(PurchaseQuotesActions.GetSeriesModels.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const { uuid } = corporate;
        const { brand, series } = payload;
        return this.modelsService.listSeriesModels(uuid, brand, series).pipe(
          map((res: IModels.ISeries) => {
            return PurchaseQuotesActions.GetSeriesModelsSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetSeriesModelsFail({
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
      ofType(PurchaseQuotesActions.GetVariants.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const data: IModels.IVariant = {
          ...payload,
          corporateUuid: corporate.uuid,
        };
        return this.modelsService.listVariants(data).pipe(
          map((res: IModels.IDocument[]) => {
            return PurchaseQuotesActions.GetVariantsSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetVariantsFail({
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
      ofType(PurchaseQuotesActions.ClearSaleBadge.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.purchaseQuoteService.clearSaleBadge(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchaseQuotesActions.ClearSaleBadgeSuccess({
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
              PurchaseQuotesActions.ClearSaleBadgeFail({
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
        ofType(PurchaseQuotesActions.ClearSaleBadgeSuccess.type),
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
        ofType(PurchaseQuotesActions.ClearSaleBadgeFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  clearAllSaleBadges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.ClearAllSaleBadges.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.purchaseQuoteService.clearAllSaleBadges(payload).pipe(
          map((data: IPurchases.IDocument) =>
            PurchaseQuotesActions.ClearAllSaleBadgesSuccess({
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
              PurchaseQuotesActions.ClearAllSaleBadgesFail({
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
        ofType(PurchaseQuotesActions.ClearAllSaleBadgesSuccess.type),
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
        ofType(PurchaseQuotesActions.ClearAllSaleBadgesFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  getGlobalBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseQuotesActions.GetGlobalBrands.type),
      switchMap(() => {
        return this.vehiclesService.getGlobalVehicleBrands().pipe(
          map((brands: string[]) => {
            return PurchaseQuotesActions.GetGlobalBrandsSuccess({
              payload: brands,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetGlobalBrandsFail({
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
      ofType(PurchaseQuotesActions.GetGlobalModels.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { brand } = payload;
        return this.vehiclesService.getGlobalVehicleModels(brand).pipe(
          map((models: string[]) => {
            return PurchaseQuotesActions.GetGlobalModelsSuccess({
              payload: models,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetGlobalModelsFail({
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
      ofType(PurchaseQuotesActions.GetGlobalVariants.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { brand, model } = payload;
        return this.vehiclesService.getGlobalVehicleVariants(brand, model).pipe(
          map((variants: string[]) => {
            return PurchaseQuotesActions.GetGlobalVariantsSuccess({
              payload: variants,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PurchaseQuotesActions.GetGlobalVariantsFail({
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

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
