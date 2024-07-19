import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ProductReferencesActions } from '../actions';

// Services
import { ProductReferencesService } from '../../services';

// Models
import { IProductReferences } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { ProductReferencesFacade } from '../facades';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class ReservationsEffects {
  constructor(
    private actions$: Actions<
      ProductReferencesActions.ProductReferencesActionsUnion
    >,
    private productReferencesService: ProductReferencesService,
    private productReferencesFacade: ProductReferencesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setReservationPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.SetProductReferencesPage.type),
      map(() => ProductReferencesActions.LoadProductReferences())
    )
  );

  loadProductReferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.LoadProductReferences.type),
      withLatestFrom(this.productReferencesFacade.productReferencesConfig$),
      switchMap(([_, params]) => {
        return this.productReferencesService.getProductReferences(params).pipe(
          map((data: IProductReferences.IData) =>
            ProductReferencesActions.LoadProductReferencesSuccess({
              references: data.docs,
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
              ProductReferencesActions.LoadProductReferencesFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  getProductReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.GetProductReference.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.productReferencesService.getProductReference(payload).pipe(
          map((data: IProductReferences.IDocument) =>
            ProductReferencesActions.GetProductReferenceSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ProductReferencesActions.GetProductReferenceFail({
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

  handleGetProductReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.GetProductReferenceFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        }),
        map(() => ProductReferencesActions.RedirectToProductReferences())
      )
  );

  handleRedirectToProductReferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.RedirectToProductReferences.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketplaces/references'],
          },
        });
      })
    )
  );

  activateProductReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.ActivateProductReference.type),
      map(action => action.payload),
      switchMap((product: IProductReferences.IDocument) => {
        return this.productReferencesService
          .activateProductReference(product)
          .pipe(
            map(() =>
              ProductReferencesActions.ActivateProductReferenceSuccess({
                payload: {
                  id: product.uuid,
                  changes: {
                    unit: product.unit,
                    active: !product.active
                  }
                }
              })
            ),
            catchError(res => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductReferencesActions.ActivateProductReferenceFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleActivateProductReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.ActivateProductReferenceFail.type),
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

  deactivateProductReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.DeactivateProductReference.type),
      map(action => action.payload),
      switchMap((product: IProductReferences.IDocument) => {
        return this.productReferencesService
          .deactivateProductReference(product)
          .pipe(
            map(() =>
              ProductReferencesActions.DeactivateProductReferenceSuccess({
                payload: {
                  id: product.uuid,
                  changes: {
                    unit: product.unit,
                    active: !product.active
                  }
                }
              })
            ),
            catchError(res => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductReferencesActions.DeactivateProductReferenceFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleDeactivateProductReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.DeactivateProductReferenceFail.type),
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

  handleActivateProductReferenceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.ActivateProductReferenceSuccess.type),
        map(action => {
          const {
            unit: { brand, model, specification }
          } = action.payload.changes;
          return this.toggleSnackbar(
            `${brand} ${model} ${specification} has been activated.`
          );
        })
      ),
    { dispatch: false }
  );

  handleDeactivateProductReferenceSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.DeactivateProductReferenceSuccess.type),
        map(action => {
          const {
            unit: { brand, model, specification }
          } = action.payload.changes;
          return this.toggleSnackbar(`${brand} ${model} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  createProductReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.CreateProductReference.type),
      map(action => action.payload),
      switchMap((payload) => {
        return this.productReferencesService
          .createProductReference(payload)
          .pipe(
            map((product: IProductReferences.IDocument) => {
              return ProductReferencesActions.CreateProductReferenceSuccess({
                payload: product
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                ProductReferencesActions.CreateProductReferenceFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleCreateProductReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.CreateProductReferenceFail.type),
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

  updateProductReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.UpdateProductReference.type),
      map(action => action.payload),
      switchMap((payload) => {
        return this.productReferencesService
          .updateProductReference(payload)
          .pipe(
            map((product: IProductReferences.IDocument) => {
              return ProductReferencesActions.UpdateProductReferenceSuccess({
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
                ProductReferencesActions.UpdateProductReferenceFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleUpdateProductReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductReferencesActions.UpdateProductReferenceFail.type),
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

  handleCreateProductReferenceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.CreateProductReferenceSuccess.type),
      map(action => {
        const {
          unit: { brand, model }
        } = action.payload;
        this.toggleSnackbar(`${brand} ${model} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketplaces/references']
          }
        });
      })
    )
  );

  handleUpdateProductReferenceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductReferencesActions.UpdateProductReferenceSuccess.type),
      map(action => {
        const {
          unit: { brand, model }
        } = action.payload.changes;
        this.toggleSnackbar(`${brand} ${model} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketplaces/references']
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
