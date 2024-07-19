import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { VehicleReferenceActions } from '../actions';

// Services
import { VehicleReferencesService } from '../../services';

// Models
import { IVehicleReference } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

// Facade
import { VehicleReferenceFacade } from '../facades';

@Injectable()
export class VehicleReferenceEffects {
  constructor(
    private actions$: Actions<
      VehicleReferenceActions.VehicleReferenceActionsUnion
    >,
    private vehicleReferencesService: VehicleReferencesService,
    private vehicleReferenceFacade: VehicleReferenceFacade,
    private snackBar: MatSnackBar
  ) {}

  filterVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.FilterVehicleReference.type),
      map(() => {
        return VehicleReferenceActions.LoadVehicleReference();
      })
    )
  );

  setVehicleReferencePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.SetVehicleReferencePage.type),
      map(() => {
        return VehicleReferenceActions.LoadVehicleReference();
      })
    )
  );

  changeVehicleReferencePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.ChangeVehicleReferencePage.type),
      map(() => {
        return VehicleReferenceActions.LoadVehicleReference();
      })
    )
  );

  sortVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.SortVehicleReference.type),
      map(() => VehicleReferenceActions.LoadVehicleReference())
    )
  );

  loadVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.LoadVehicleReference.type),
      withLatestFrom(this.vehicleReferenceFacade.vehicleReferencesConfig$),
      switchMap(([_, params]) => {
        return this.vehicleReferencesService.getVehicleReferences(params).pipe(
          map((data: IVehicleReference.IData) =>
            VehicleReferenceActions.LoadVehicleReferenceSuccess({
              vehicleReference: data.docs,
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
              VehicleReferenceActions.LoadVehicleReferenceFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  createVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.CreateVehicleReference.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.vehicleReferencesService.createVehicleReference(payload).pipe(
          map((vehicleReference: IVehicleReference.IDocument) =>
            VehicleReferenceActions.CreateVehicleReferenceSuccess({
              payload: vehicleReference,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehicleReferenceActions.CreateVehicleReferenceFail({
                payload: message,
              })
            );
          })
        )
      )
    )
  );

  getVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.GetVehicleReference.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.vehicleReferencesService.getVehicleReference(payload).pipe(
          map((data: IVehicleReference.IDocument) =>
            VehicleReferenceActions.GetVehicleReferenceSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehicleReferenceActions.GetVehicleReferenceFail({
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

  handleGetVehicleReferenceFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.GetVehicleReferenceFail.type),
      map((action) => {
        return this.toggleSnackbar(`${action.payload.message}`);
      }),
      map(() => VehicleReferenceActions.RedirectToVehicleReferences())
    )
  );

  handleRedirectToVehicleReferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.RedirectToVehicleReferences.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/vehicles/references'],
          },
        });
      })
    )
  );

  handleCreateVehicleReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.CreateVehicleReferenceFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  updateVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.UpdateVehicleReference.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.vehicleReferencesService.updateVehicleReference(payload).pipe(
          map((vehicleReference: IVehicleReference.IDocument) =>
            VehicleReferenceActions.UpdateVehicleReferenceSuccess({
              payload: {
                id: payload.uuid,
                changes: vehicleReference,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehicleReferenceActions.UpdateVehicleReferenceFail({
                payload: message,
              })
            );
          })
        )
      )
    )
  );

  handleUpdateVehicleReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.UpdateVehicleReferenceFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCreateVehicleReferenceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.CreateVehicleReferenceSuccess.type),
      map((action) => {
        const {
          unit: { brand, model },
        } = action.payload;
        this.toggleSnackbar(`${brand} ${model} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Back();
      })
    )
  );

  handleUpdateVehicleReferenceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.UpdateVehicleReferenceSuccess.type),
      map((action) => {
        const {
          unit: { brand, model },
        } = action.payload.changes;
        this.toggleSnackbar(`${brand} ${model} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Back();
      })
    )
  );

  loadVehicleReferenceBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.LoadVehicleReferenceBrands.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { type } = payload;
        return this.vehicleReferencesService.getVehicleBrands(type).pipe(
          map((brands: string[]) =>
            VehicleReferenceActions.LoadVehicleReferenceBrandsSuccess({
              payload: brands,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehicleReferenceActions.LoadVehicleReferenceBrandsFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleLoadVehicleReferenceBrandsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.LoadVehicleReferenceBrandsFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  loadVehicleReferenceModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.LoadVehicleReferenceModels.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { type, brand } = payload;
        return this.vehicleReferencesService.getVehicleModels(type, brand).pipe(
          map((models: string[]) =>
            VehicleReferenceActions.LoadVehicleReferenceModelsSuccess({
              payload: models,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehicleReferenceActions.LoadVehicleReferenceModelsFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleLoadVehicleReferenceModelsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.LoadVehicleReferenceModelsFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  loadVehicleReferenceVariants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.LoadVehicleReferenceVariants.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { type, brand, model } = payload;
        return this.vehicleReferencesService
          .getVehicleVariants(type, brand, model)
          .pipe(
            map((variants: IVehicleReference.IVariants[]) =>
              VehicleReferenceActions.LoadVehicleReferenceVariantsSuccess({
                payload: variants,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                VehicleReferenceActions.LoadVehicleReferenceVariantsFail({
                  payload: message,
                })
              );
            })
          );
      })
    )
  );

  handleLoadVehicleReferenceVariantsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.LoadVehicleReferenceVariantsFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  activeVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.ActivateVehicleReference.type),
      map((action) => action.payload),
      switchMap((vehicleReference: IVehicleReference.IDocument) => {
        return this.vehicleReferencesService
          .activateVehicleReference(vehicleReference)
          .pipe(
            map(() =>
              VehicleReferenceActions.ActivateVehicleReferenceSuccess({
                payload: {
                  id: vehicleReference.uuid,
                  changes: {
                    active: !vehicleReference.active,
                  },
                },
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                VehicleReferenceActions.ActivateVehicleReferenceFail({
                  payload: message,
                })
              );
            })
          );
      })
    )
  );

  handleActivateVehicleReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.ActivateVehicleReferenceFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  deactivateVehicleReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleReferenceActions.DeactivateVehicleReference.type),
      map((action) => action.payload),
      switchMap((vehicleReference: IVehicleReference.IDocument) => {
        return this.vehicleReferencesService
          .deactivateVehicleReference(vehicleReference)
          .pipe(
            map(() =>
              VehicleReferenceActions.DeactivateVehicleReferenceSuccess({
                payload: {
                  id: vehicleReference.uuid,
                  changes: {
                    active: !vehicleReference.active,
                  },
                },
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                VehicleReferenceActions.DeactivateVehicleReferenceFail({
                  payload: message,
                })
              );
            })
          );
      })
    )
  );

  handleDeactivateVehicleReferenceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehicleReferenceActions.DeactivateVehicleReferenceFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
