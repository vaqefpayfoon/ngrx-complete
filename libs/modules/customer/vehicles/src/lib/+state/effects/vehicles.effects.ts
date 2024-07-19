import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { VehiclesActions } from '../actions';

// Services
import { VehiclesService } from '../../services';

// Models
import { IVehicle } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

// Facade
import { VehiclesFacade } from '../facades';
import { AuthFacade } from '@neural/auth';

@Injectable()
export class VehiclesEffects {
  constructor(
    private actions$: Actions<VehiclesActions.VehiclesActionsUnion>,
    private vehiclesService: VehiclesService,
    private vehiclesFacade: VehiclesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setVehiclesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.SetVehiclesPage.type),
      switchMap(() => [
        VehiclesActions.TyreWidths(),
        VehiclesActions.RearTyreWidths(),
        VehiclesActions.LoadVehicles(),
      ])
    )
  );

  filterVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.FilterVehicles.type),
      map(() => {
        return VehiclesActions.LoadVehicles();
      })
    )
  );

  changeVehiclePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.ChangeVehiclesPage.type),
      map(() => {
        return VehiclesActions.LoadVehicles();
      })
    )
  );

  sortVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.SortVehicles.type),
      map(() => VehiclesActions.LoadVehicles())
    )
  );

  loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.LoadVehicles.type),
      withLatestFrom(
        this.vehiclesFacade.vehiclesConfig$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, params, corporate]) => {
        const { uuid } = corporate;
        return this.vehiclesService.getVehicles(params, uuid).pipe(
          map((data: IVehicle.IData) =>
            VehiclesActions.LoadVehiclesSuccess({
              vehicles: data.docs,
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
            return of(VehiclesActions.LoadVehiclesFail({ payload: message }));
          })
        );
      })
    )
  );

  searchVehicleByNumberPlate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.SearchVehicleByNumberPlate.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([{ payload }, selectedCorporate]) => {
        const config: IVehicle.IConfig = {
          filter: {
            numberPlate: payload,
          },
          limit: 1,
          page: 1,
        };

        const { uuid } = selectedCorporate;
        return this.vehiclesService.getVehicles(config, uuid).pipe(
          map((data: IVehicle.IData) => {
            const [filteredVehicle] = data.docs;

            return VehiclesActions.SearchVehicleByNumberPlateSuccess({
              payload: filteredVehicle,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.SearchVehicleByNumberPlateFail({
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

  handleSearchVehicleByNumberPlateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.SearchVehicleByNumberPlateFail.type),
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

  handleSearchVehicleByNumberPlateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.SearchVehicleByNumberPlateSuccess.type),
      map((action) => action.payload),
      switchMap((vehicle) => {
        return [
          VehiclesActions.LoadVehicleBrands(),
          VehiclesActions.LoadVehiclesInspections({
            payload: vehicle.uuid,
          }),
        ];
      })
    )
  );

  updateVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.UpdateVehicle.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.vehiclesService
          .updateVehicle(payload.document, payload.update)
          .pipe(
            map((data: any) => {
              return VehiclesActions.UpdateVehicleSuccess({
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
                VehiclesActions.UpdateVehicleFail({ payload: message })
              );
            })
          )
      )
    )
  );

  updateSearchedVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.UpdateSearchedVehicle.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.vehiclesService
          .updateVehicle(payload.document, payload.update)
          .pipe(
            map((data: IVehicle.IDocument) => {
              return VehiclesActions.UpdateSearchedVehicleSuccess({
                payload: data,
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                VehiclesActions.UpdateSearchedVehicleFail({
                  payload: {
                    status: res.status,
                    message,
                  },
                })
              );
            })
          )
      )
    )
  );

  handleUpdateVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.UpdateVehicleSuccess.type),
      map((action) => {
        const { numberPlate } = action.payload.changes;
        this.toggleSnackbar(`${numberPlate} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Back();
      })
    )
  );

  getVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.GetVehicle.type),
      map(action => action.payload),
      switchMap(payload =>
        this.vehiclesService.getVehicle(payload).pipe(
          map((data: IVehicle.IDocument) =>
            VehiclesActions.GetVehicleSuccess({ payload: data })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(VehiclesActions.GetVehicleFail({ payload: message }));
          })
        )
      )
    )
  );

  handleGetVehicleFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.GetVehicleFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => VehiclesActions.RedirectToVehicles())
      )
  );

  handleRedirectToVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.RedirectToVehicles.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/vehicles'],
          },
        });
      })
    )
  );
  handleUpdateSearchedVehicleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.UpdateSearchedVehicleSuccess.type),
      map((action) => {
        const { numberPlate } = action.payload;
        this.toggleSnackbar(`${numberPlate} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Back();
      })
    )
  );

  loadVehiclesInspections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.LoadVehiclesInspections.type),
      map((action) => action.payload),
      switchMap((payload) =>
        this.vehiclesService.getVehicleInspections(payload).pipe(
          map((data) =>
            VehiclesActions.LoadVehiclesInspectionsSuccess({
              inspections: data.docs,
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
              VehiclesActions.LoadVehiclesInspectionsFail({
                payload: message,
              })
            );
          })
        )
      )
    )
  );

  tyreWidths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.TyreWidths.type),
      switchMap(() => {
        return this.vehiclesService.getTyreWidths().pipe(
          map((widths) =>
            VehiclesActions.TyreWidthsSuccess({
              payload: widths,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(VehiclesActions.TyreWidthsFail({ payload: message }));
          })
        );
      })
    )
  );

  tyreAspectRatios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.TyreAspectRatios.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.vehiclesService.getTyreAspectRatios(payload.width).pipe(
          map((widths) =>
            VehiclesActions.TyreAspectRatiosSuccess({
              payload: widths,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.TyreAspectRatiosFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleTyreAspectRatiosFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.TyreAspectRatiosFail.type),
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

  tyreRims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.TyreRims.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { aspectRatio, width } = payload;
        return this.vehiclesService.getTyreRims(width, aspectRatio).pipe(
          map((widths) =>
            VehiclesActions.TyreRimsSuccess({
              payload: widths,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(VehiclesActions.TyreRimsFail({ payload: message }));
          })
        );
      })
    )
  );

  handleTyreRimsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.TyreRimsFail.type),
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

  rearTyreWidths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.RearTyreWidths.type),
      switchMap(() => {
        return this.vehiclesService.getTyreWidths().pipe(
          map((widths) =>
            VehiclesActions.RearTyreWidthsSuccess({
              payload: widths,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(VehiclesActions.RearTyreWidthsFail({ payload: message }));
          })
        );
      })
    )
  );

  rearTyreAspectRatios$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.RearTyreAspectRatios.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.vehiclesService.getTyreAspectRatios(payload.width).pipe(
          map((widths) =>
            VehiclesActions.RearTyreAspectRatiosSuccess({
              payload: widths,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.RearTyreAspectRatiosFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleRearTyreAspectRatiosFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.RearTyreAspectRatiosFail.type),
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

  rearTyreRims$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.RearTyreRims.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { aspectRatio, width } = payload;
        return this.vehiclesService.getTyreRims(width, aspectRatio).pipe(
          map((widths) =>
            VehiclesActions.RearTyreRimsSuccess({
              payload: widths,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(VehiclesActions.RearTyreRimsFail({ payload: message }));
          })
        );
      })
    )
  );

  handleRearTyreRimsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.RearTyreRimsFail.type),
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

  activeVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.ActivateVehicle.type),
      map((action) => action.payload),
      switchMap((payload: IVehicle.IDocument) => {
        return this.vehiclesService.activateVehicle(payload).pipe(
          map(() =>
            VehiclesActions.ActivateVehicleSuccess({
              payload: {
                id: payload.uuid,
                changes: {
                  active: !payload.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.ActivateVehicleFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleActivateVehicleFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.ActivateVehicleFail.type),
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

  deactivateVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.DeactivateVehicle.type),
      map((action) => action.payload),
      switchMap((payload: IVehicle.IDocument) => {
        return this.vehiclesService.deactivateVehicle(payload).pipe(
          map(() =>
            VehiclesActions.DeactivateVehicleSuccess({
              payload: {
                id: payload.uuid,
                changes: {
                  active: !payload.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.DeactivateVehicleFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleDeactivateVehicleFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.DeactivateVehicleFail.type),
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

  // handleUpdateVehicleSuccess$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(VehiclesActions.UpdateVehicleSuccess.type),
  //     map(action => {
  //       const { type, numberPlate } = action.payload.changes;
  //       this.toggleSnackbar(`${numberPlate} has been updated.`);

  //       let route = '';

  //       if (type === IVehicle.FleetType.CAR) {
  //         route = '/app/customer/vehicles/car';
  //       }
  //       if (type === IVehicle.FleetType.BIKE) {
  //         route = '/app/customer/vehicles/bike';
  //       }

  //       return fromRoot.RouterActions.Go({
  //         payload: {
  //           path: [route]
  //         }
  //       });
  //     })
  //   )
  // );

  loadVehicleBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.LoadVehicleBrands.type),
      switchMap(() => {
        return this.vehiclesService.getVehicleBrands().pipe(
          map((brands: string[]) =>
            VehiclesActions.LoadVehicleBrandsSuccess({
              payload: brands,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.LoadVehicleBrandsFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleLoadVehicleBrandsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.LoadVehicleBrandsFail.type),
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

  loadVehicleModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.LoadVehicleModels.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { brand } = payload;
        return this.vehiclesService.getVehicleModels(brand).pipe(
          map((models: string[]) =>
            VehiclesActions.LoadVehicleModelsSuccess({
              payload: models,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.LoadVehicleModelsFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleLoadVehicleModelsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.LoadVehicleModelsFail.type),
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

  loadVehicleVariants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.LoadVehicleVariants.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { brand, model } = payload;
        return this.vehiclesService.getVehicleVariants(brand, model).pipe(
          map((variants) =>
            VehiclesActions.LoadVehicleVariantsSuccess({
              payload: variants,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              VehiclesActions.LoadVehicleVariantsFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleLoadVehicleVariantsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(VehiclesActions.LoadVehicleVariantsFail.type),
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

  handleGoToVehiclesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehiclesActions.GoToVehiclesList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/vehicles'],
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
