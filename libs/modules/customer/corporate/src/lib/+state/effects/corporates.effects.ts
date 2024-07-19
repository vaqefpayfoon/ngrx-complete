import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CorporatesActions, BranchesActions } from '../actions';

// Services
import { CorporatesService } from '../../services';

// Models
import { ICorporates } from '../../models';

// RxJs
import { of, Observable, from } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { CorporatesFacade } from '../facades';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

// Facades
import { AuthFacade } from '@neural/auth';
import { IAccount } from '@neural/modules/administration';

@Injectable()
export class CorporatesEffects {
  constructor(
    private actions$: Actions<CorporatesActions.CorporatesActionsUnion>,
    private corporatesService: CorporatesService,
    private corporatesFacade: CorporatesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setCorporatesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.SetCorporatesPage.type),
      map(() => CorporatesActions.LoadCorporates())
    )
  );

  loadCorporates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.LoadCorporates.type),
      withLatestFrom(this.corporatesFacade.corporatesConfig$),
      switchMap(([_, params]) => {
        return this.corporatesService.getCorporates(params).pipe(
          map((data: ICorporates.IData) =>
            CorporatesActions.LoadCorporatesSuccess({
              corporates: data.docs,
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
              CorporatesActions.LoadCorporatesFail({ payload: message })
            );
          })
        );
      })
    )
  );

  loadCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.LoadCorporate.type),
      map((action) => action.payload),
      switchMap((uuid: string) => {
        return this.corporatesService.getCorporate(uuid).pipe(
          map((corporate: ICorporates.IDocument) =>
            CorporatesActions.LoadCorporateSuccess({ payload: corporate })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.LoadCorporateFail({ payload: message })
            );
          })
        );
      })
    )
  );

  activeCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.ActivateCorporate.type),
      map((action) => action.payload),
      switchMap((corporate: ICorporates.IDocument) => {
        return this.corporatesService.activateCorporate(corporate).pipe(
          map(() =>
            CorporatesActions.ActivateCorporateSuccess({
              payload: {
                id: corporate.uuid,
                changes: {
                  name: corporate.name,
                  active: !corporate.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.ActivateCorporateFail({ payload: message })
            );
          })
        );
      })
    )
  );

  deactivateCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.DeactivateCorporate.type),
      map((action) => action.payload),
      switchMap((corporate: ICorporates.IDocument) => {
        return this.corporatesService.deactivateCorporate(corporate).pipe(
          map(() =>
            CorporatesActions.DeactivateCorporateSuccess({
              payload: {
                id: corporate.uuid,
                changes: {
                  name: corporate.name,
                  active: !corporate.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.DeactivateCorporateFail({ payload: message })
            );
          })
        );
      })
    )
  );

  createCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.CreateCorporate.type),
      map((action) => action.payload),
      switchMap((payload: ICorporates.ICreate) => {
        return this.corporatesService.createCorporate(payload).pipe(
          map((corporate: ICorporates.IDocument) => {
            return CorporatesActions.CreateCorporateSuccess({
              payload: corporate,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.CreateCorporateFail({ payload: message })
            );
          })
        );
      })
    )
  );

  updateCorporate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.UpdateCorporate.type),
      map((action) => action.payload),
      switchMap((payload: ICorporates.IDocument) => {
        return this.corporatesService.updateCorporate(payload).pipe(
          map((corporate: ICorporates.IDocument) => {
            return CorporatesActions.UpdateCorporateSuccess({
              payload: {
                id: corporate.uuid,
                changes: corporate,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.UpdateCorporateFail({ payload: message })
            );
          })
        );
      })
    )
  );

  getSaleAdvisors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.GetCorporateOperations.type),
      map((action) => action.payload),

      switchMap((payload) => {
        const { uuid } = payload;

        const config: ICorporates.IConfig = {
          limit: 1000,
          page: 1,
        };

        return this.corporatesService.getOperationAccounts(uuid, config).pipe(
          map((data: ICorporates.IOperationData) =>
            CorporatesActions.GetCorporateOperationsSuccess({
              payload: data.docs,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.GetCorporateOperationsFail({
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

  updateCorporateImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.UpdateCorporateImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.corporatesService.updateCorporateImage(payload).pipe(
          map((corporate: ICorporates.IDocument) => {
            return CorporatesActions.UpdateCorporateImageSuccess({
              payload: {
                id: corporate.uuid,
                changes: corporate,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.UpdateCorporateImageFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleGetCorporateFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.LoadCorporateFail.type),
      map((action) => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => CorporatesActions.RedirectToCorporates())
    )
  );

  handleRedirectToCorporates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.RedirectToCorporates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/corporates'],
          },
        });
      })
    )
  );

  handleUpdateCorporateImageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.UpdateCorporateImageSuccess.type),
      map((action) => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} image has been updated.`);
        return action.payload.changes;
      }),
      map((p: any) => {
        const file = p.file;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const corporate = {
            ...p,
            file: reader.result,
          };

          return CorporatesActions.UpdateCorporateSuccess({
            payload: {
              id: corporate.uuid,
              changes: corporate,
            },
          });
        };
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/corporates'],
          },
        });
      })
    )
  );

  handleUpdateCorporateImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CorporatesActions.UpdateCorporateImageFail.type),
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

  handleActivateCorporateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CorporatesActions.ActivateCorporateSuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateCorporateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CorporatesActions.DeactivateCorporateSuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleCreateCorporateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.CreateCorporateSuccess.type),
      map((action) => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created.`);
        return action.payload;
      }),
      map((payload) => {
        const { uuid } = payload;
        return BranchesActions.LoadBranches({ payload: uuid });
      })
    )
  );

  handleUpdateCorporateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.UpdateCorporateSuccess.type),
      map((action) => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/corporates'],
          },
        });
      })
    )
  );

  uploadSocialIcon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.UploadSocialIcon.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const { file, corporate } = payload;

        return this.corporatesService.uploadSocialIcon(file, corporate).pipe(
          map((image: string) => {
            return CorporatesActions.UploadSocialIconSuccess({
              payload: image,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.UploadSocialIconFail({ payload: message })
            );
          })
        );
      })
    )
  );

  uploadAppImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CorporatesActions.UploadAppImage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.corporatesService.uploadAppImage(payload).pipe(
          map((image: string) => {
            return CorporatesActions.UploadAppImageSuccess({
              payload: {
                [`${payload.key}`]: image,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CorporatesActions.UploadSocialIconFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleUploadSocialIconFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CorporatesActions.UploadSocialIconFail.type),
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

  handleUpdateCorporateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CorporatesActions.UpdateCorporateFail.type),
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
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
