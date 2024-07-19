import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CarModelsActions } from '../actions';

// Services
import { ModelsService } from '../../services';

// Models
import { IModels } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { CarModelsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class CarModelsEffects {
  constructor(
    private actions$: Actions<CarModelsActions.CarModelsActionsUnion>,
    private modelsService: ModelsService,
    private carModelsFacade: CarModelsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setModelsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.SetModelsPage.type),
      switchMap(() => [
        CarModelsActions.LoadModels(),
        CarModelsActions.GetBrandsAndSeries(),
      ])
    )
  );

  loadModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.LoadModels.type),
      withLatestFrom(
        this.carModelsFacade.modelsConfig$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, params, corporate]) => {
        const { uuid } = corporate;
        return this.modelsService.getModels(params, uuid).pipe(
          map((data: IModels.IData) =>
            CarModelsActions.LoadModelsSuccess({
              models: data.docs,
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
            return of(CarModelsActions.LoadModelsFail({ payload: message }));
          })
        );
      })
    )
  );

  activeModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.ActivateModel.type),
      map((action) => action.payload),
      switchMap((model: IModels.IDocument) => {
        return this.modelsService.activateModel(model).pipe(
          map(() =>
            CarModelsActions.ActivateModelSuccess({
              payload: {
                id: model.uuid,
                changes: {
                  active: !model.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CarModelsActions.ActivateModelFail({ payload: message }));
          })
        );
      })
    )
  );

  handleActivateModelFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.ActivateModelFail.type),
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

  deactivateModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.DeactivateModel.type),
      map((action) => action.payload),
      switchMap((model: IModels.IDocument) => {
        return this.modelsService.deactivateModel(model).pipe(
          map(() =>
            CarModelsActions.DeactivateModelSuccess({
              payload: {
                id: model.uuid,
                changes: {
                  active: !model.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.DeactivateModelFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleDeactivateModelFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.DeactivateModelFail.type),
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

  createModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.CreateModel.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.createModel(payload).pipe(
          map((model) =>
            CarModelsActions.CreateModelSuccess({ payload: model })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CarModelsActions.CreateModelFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateModelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.CreateModelSuccess.type),
      map((action) => {
        const { unit } = action.payload;
        this.toggleSnackbar(
          `${unit.brand} ${unit.model} ${unit.variant} has been created.`
        );
        return action.payload;
      }),
      map((payload) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/models/list`],
          },
        });
      })
    )
  );

  handleCreateModelFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.CreateModelFail.type),
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

  updateModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UpdateModel.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.updateModel(payload).pipe(
          map((model) =>
            CarModelsActions.UpdateModelSuccess({
              payload: {
                id: model.uuid,
                changes: model,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CarModelsActions.UpdateModelFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdateModelSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UpdateModelSuccess.type),
      map((action) => {
        const { unit } = action.payload.changes;
        this.toggleSnackbar(
          `${unit.brand} ${unit.model} ${unit.variant} has been updated.`
        );
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/models'],
          },
        });
      })
    )
  );

  handleUpdateModelFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.UpdateModelFail.type),
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

  uploadInteriorGalleryColorImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UploadInteriorGalleryColorImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.uploadGalleryImage(payload.model).pipe(
          map((url) =>
            CarModelsActions.UploadInteriorGalleryColorImageSuccess({
              payload: url,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.UploadInteriorGalleryColorImageFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  uploadExteriorGalleryColorImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UploadExteriorGalleryColorImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.uploadGalleryImage(payload.model).pipe(
          map((url) =>
            CarModelsActions.UploadExteriorGalleryColorImageSuccess({
              payload: url,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.UploadExteriorGalleryColorImageFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  uploadInteriorGalleryImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UploadInteriorGalleryImages.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.uploadGalleryImage(payload.model).pipe(
          map((url) =>
            CarModelsActions.UploadInteriorGalleryImagesSuccess({
              payload: url,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.UploadInteriorGalleryImagesFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  uploadExteriorGalleryImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UploadExteriorGalleryImages.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.uploadGalleryImage(payload.model).pipe(
          map((url) =>
            CarModelsActions.UploadExteriorGalleryImagesSuccess({
              payload: url,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.UploadExteriorGalleryImagesFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  setBranches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.SetBranches.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { model, branches } = payload;
        return this.modelsService.setBranches(branches, model).pipe(
          map((modelDocument) =>
            CarModelsActions.SetBranchesSuccess({
              payload: {
                id: modelDocument.uuid,
                changes: modelDocument,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.SetBranchesFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleSetBranchesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.SetBranchesSuccess.type),
      map((action) => {
        const { unit } = action.payload.changes;
        this.toggleSnackbar(
          `${unit.brand} ${unit.model} ${unit.variant} has been updated.`
        );
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/models'],
          },
        });
      })
    )
  );

  setBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.SetBranch.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.setBranches(payload).pipe(
          map(() => CarModelsActions.SetBranchSuccess()),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.SetBranchFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleSetBranchSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.SetBranchSuccess.type),
      map(() => {
        return this.toggleSnackbar(`Model's Branch has been updated.`);
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/models'],
          },
        });
      })
    )
  );

  getBrandsAndSeries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.GetBrandsAndSeries.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        const { uuid } = corporate;
        return this.modelsService.listBrandsAndSeries(uuid).pipe(
          map((brandsAndSeries: IModels.IBrand[]) => {
            return CarModelsActions.GetBrandsAndSeriesSuccess({
              payload: brandsAndSeries,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.GetBrandsAndSeriesFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  uploadSeriesImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UploadSeriesImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.uploadSeriesImage(payload).pipe(
          map((url) =>
            CarModelsActions.UploadSeriesImageSuccess({
              payload: url,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.UploadSeriesImageFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleUploadSeriesImageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UploadSeriesImageSuccess.type),
      map(() => {
        return this.toggleSnackbar(`Series image has been updated.`);
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/models'],
          },
        });
      })
    )
  );

  getModel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.GetModel.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, selectedCorporate]) => {
        const { uuid } = selectedCorporate;
        return this.modelsService.getModel(payload, uuid).pipe(
          map((document) =>
            CarModelsActions.GetModelImage({
              payload: document,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.GetModelFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleGetModelFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.GetModelFail.type),
      map((action) => {
        const message = action.payload;
        return this.toggleSnackbar(message);
      }),
      map(() => CarModelsActions.RedirectToCarModels())
    )
  );

  handleRedirectToCarModels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.RedirectToCarModels.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/models/list'],
          },
        });
      })
    )
  );

  getModelImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.GetModelImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.getModelImage(payload).pipe(
          switchMap((document) => [
            CarModelsActions.GetModelImageSuccess({
              payload: document,
            }),
            CarModelsActions.GetModelSuccess({ payload: document }),
          ]),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.GetModelImageFail({
                payload: message,
              }),
              CarModelsActions.GetModelSuccess({ payload })
            );
          })
        );
      })
    )
  );

  selectModelImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.SelectModelImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.getModelImage(null, payload).pipe(
          map((url) =>
            CarModelsActions.SelectModelImageSuccess({
              payload: url,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.SelectModelImageFail({
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
      ofType(CarModelsActions.GetSeriesModels.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const { uuid } = corporate;
        const { brand, series } = payload;
        return this.modelsService.listSeriesModels(uuid, brand, series).pipe(
          map((res: IModels.ISeries) => {
            return CarModelsActions.GetSeriesModelsSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.GetSeriesModelsFail({
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
      ofType(CarModelsActions.GetVariants.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.listVariants(payload).pipe(
          map((res: IModels.IDocument[]) => {
            return CarModelsActions.GetVariantsSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.GetVariantsFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleGetVariantsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.GetVariantsFail.type),
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

  updateModelImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UpdateModelImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.modelsService.setModelImage(payload).pipe(
          map((res) => {
            return CarModelsActions.UpdateModelImageSuccess({
              payload: res,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CarModelsActions.UpdateModelImageFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );

  handleUpdateModelImageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.UpdateModelImageSuccess.type),
      map(() => {
        return this.toggleSnackbar(`Model image has been updated.`);
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/models'],
          },
        });
      })
    )
  );

  handleUpdateModelImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.UpdateModelImageFail.type),
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

  deleteModelGalleryImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarModelsActions.DeleteModelGalleryImage.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const { uuid: corporateUuid } = corporate;
        return this.modelsService
          .deleteGalleryImage({ ...payload, corporateUuid })
          .pipe(
            map(() => {
              return CarModelsActions.DeleteModelGalleryImageSuccess();
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CarModelsActions.DeleteModelGalleryImageFail({
                  payload: message,
                })
              );
            })
          );
      })
    )
  );

  handleDeleteModelGalleryImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.DeleteModelGalleryImageFail.type),
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

  handleDeleteModelGalleryImageSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CarModelsActions.DeleteModelGalleryImageSuccess.type),
        map(() => {
          return this.toggleSnackbar(
            `Model image has been deleted. Before you exit please update the form.`
          );
        })
      ),
    {
      dispatch: false,
    }
  );

  //   selectModelImage$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(CarModelsActions.SelectModelImage.type),
  //     map(action => action.payload),
  //     switchMap((payload) => {
  //       return this.modelsService.getModelImage(payload).pipe(
  //         map(url =>
  //           CarModelsActions.SelectModelImageSuccess({
  //             payload: url
  //           })
  //         ),
  //         catchError((res: any) => {
  //           const message =
  //             res.status !== 401 ? res.error.response.message : null;
  //           return of(
  //             CarModelsActions.SelectModelImageFail({
  //               payload: message
  //             })
  //           );
  //         })
  //       );
  //     })
  //   )
  // );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
