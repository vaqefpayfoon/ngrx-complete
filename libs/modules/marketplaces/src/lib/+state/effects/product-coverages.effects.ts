import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ProductCoveragesActions } from '../actions';

// Services
import { ProductCoveragesService } from '../../services';

// Models
import { IProductCoverages } from '../../models';

import { AuthFacade } from '@neural/auth';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { ProductCoveragesFacade } from '../facades';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class ProductCoveragesEffects {
  constructor(
    private actions$: Actions<
      ProductCoveragesActions.ProductCoveragesActionsUnion
    >,
    private productCoveragessService: ProductCoveragesService,
    private productCoveragesFacade: ProductCoveragesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setReservationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.SetProductCoveragesPage.type),
      map(() => ProductCoveragesActions.LoadProductCoverages())
    )
  );

  loadProductCoverages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.LoadProductCoverages.type),
      withLatestFrom(
        this.productCoveragesFacade.productCoveragesConfig$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, params, { uuid }]) => {
        return this.productCoveragessService
          .getProductCoverages(uuid, params)
          .pipe(
            map((data: IProductCoverages.IData) =>
              ProductCoveragesActions.LoadProductCoveragesSuccess({
                coverages: data.docs,
                pagination: {
                  limit: data.limit,
                  page: data.page,
                  pages: data.pages,
                  total: data.total
                }
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.LoadProductCoveragesFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  getProductCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.GetProductCoverage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.productCoveragessService.getProductCoverage(payload).pipe(
          map((data: IProductCoverages.IDocument) =>
            ProductCoveragesActions.GetProductCoverageSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ProductCoveragesActions.GetProductCoverageFail({
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

  handleGetProductCoverageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.GetProductCoverageFail.type),
        map((action) => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => ProductCoveragesActions.RedirectToProductCoverages())
      )
  );

  handleRedirectToProductCoverages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.RedirectToProductCoverages.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketplaces/inventory'],
          },
        });
      })
    )
  );

  activateProductCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.ActivateProductCoverage.type),
      map(action => action.payload),
      switchMap((product: IProductCoverages.IDocument) => {
        return this.productCoveragessService
          .activateProductCoverage(product)
          .pipe(
            map(() =>
              ProductCoveragesActions.ActivateProductCoverageSuccess({
                payload: {
                  id: product.uuid,
                  changes: {
                    productReference: product.productReference,
                    active: !product.active
                  }
                }
              })
            ),
            catchError(res => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.ActivateProductCoverageFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleActivateProductCoverageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.ActivateProductCoverageFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  deleteProductCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.DeleteProductCoverage.type),
      map(action => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([product, corporate]) => {
        const { uuid } = corporate;
        return this.productCoveragessService
          .deleteVehicleCoverage(uuid, product)
          .pipe(
            map(() =>
              ProductCoveragesActions.DeleteProductCoverageSuccess({
                payload: product
              })
            ),
            catchError(res => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.DeleteProductCoverageFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleDeleteProductCoverageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.DeleteProductCoverageFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  loadProductBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.LoadProductBrands.type),
      map(action => action.payload),
      switchMap((payload: string) => {
        return this.productCoveragessService.getProductBrands(payload).pipe(
          map((brands: string[]) =>
            ProductCoveragesActions.LoadProductBrandsSuccess({
              payload: brands
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ProductCoveragesActions.LoadProductBrandsFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleLoadProductBrandsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.LoadProductBrandsFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  loadProductModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.LoadProductModels.type),
      map(action => action.payload),
      switchMap(payload => {
        const { brand, serviceType } = payload;
        return this.productCoveragessService
          .getProductModels(brand, serviceType)
          .pipe(
            map((models: IProductCoverages.IModel[]) =>
              ProductCoveragesActions.LoadProductModelsSuccess({
                payload: models
              })
            ),
            catchError(res => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.LoadProductModelsFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleLoadProductModelsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.LoadProductModelsFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  deactivateProductCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.DeactivateProductCoverage.type),
      map(action => action.payload),
      switchMap((product: IProductCoverages.IDocument) => {
        return this.productCoveragessService
          .deactivateProductCoverage(product)
          .pipe(
            map(() =>
              ProductCoveragesActions.DeactivateProductCoverageSuccess({
                payload: {
                  id: product.uuid,
                  changes: {
                    productReference: product.productReference,
                    active: !product.active
                  }
                }
              })
            ),
            catchError(res => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.DeactivateProductCoverageFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleDeactivateProductCoverageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.DeactivateProductCoverageFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleActivateProductCoverageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.ActivateProductCoverageSuccess.type),
        map(action => {
          const {
            productReference: {
              unit: { brand, model }
            }
          } = action.payload.changes;
          return this.toggleSnackbar(`${brand} ${model} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateProductCoverageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.DeactivateProductCoverageSuccess.type),
        map(action => {
          const {
            productReference: {
              unit: { brand, model }
            }
          } = action.payload.changes;
          return this.toggleSnackbar(`${brand} ${model} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeleteProductCoverageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.DeleteProductCoverageSuccess.type),
        map(action => {
          const { partNumber } = action.payload;
          return this.toggleSnackbar(`${partNumber} has been deleted.`);
        })
      ),
    { dispatch: false }
  );

  createProductCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.CreateProductCoverage.type),
      map(action => action.payload),
      switchMap((payload: IProductCoverages.ICreate) => {
        return this.productCoveragessService
          .createProductCoverage(payload)
          .pipe(
            map((product: IProductCoverages.IDocument) => {
              return ProductCoveragesActions.CreateProductCoverageSuccess({
                payload: product
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.CreateProductCoverageFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleCreateProductCoverageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.CreateProductCoverageFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  updateProductCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.UpdateProductCoverage.type),
      map(action => action.payload),
      switchMap((payload: IProductCoverages.IDocument) => {
        return this.productCoveragessService
          .updateProductCoverage(payload)
          .pipe(
            map((product: IProductCoverages.IDocument) => {
              return ProductCoveragesActions.UpdateProductCoverageSuccess({
                payload: {
                  id: product.uuid,
                  changes: product
                }
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductCoveragesActions.UpdateProductCoverageFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleUpdateProductCoverageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductCoveragesActions.UpdateProductCoverageFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleCreateProductCoverageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.CreateProductCoverageSuccess.type),
      map(action => {
        const { partNumber } = action.payload;
        this.toggleSnackbar(`${partNumber} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketplaces/inventory']
          }
        });
      })
    )
  );

  handleUpdateProductCoverageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductCoveragesActions.UpdateProductCoverageSuccess.type),
      map(action => {
        const { partNumber } = action.payload.changes;
        this.toggleSnackbar(`${partNumber} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketplaces/inventory']
          }
        });
      })
    )
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
