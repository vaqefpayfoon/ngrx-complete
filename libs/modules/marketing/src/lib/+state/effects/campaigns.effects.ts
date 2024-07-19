import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CampaignsActions } from '../actions';

// Services
import { CampaignsService } from '../../services';

// Models
import { ICampaigns } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { CampaignsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

import { IUpload, SharedService } from '@neural/ui';

@Injectable()
export class CampaignsEffects {
  constructor(
    private actions$: Actions<CampaignsActions.CampaignsActionsUnion>,
    private campaignsService: CampaignsService,
    private sharedService: SharedService,
    private campaignsFacade: CampaignsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setCampaignsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.SetCampaignsPage.type),
      map(() => CampaignsActions.LoadCampaigns())
    )
  );

  loadCampaigns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.LoadCampaigns.type),
      withLatestFrom(
        this.campaignsFacade.campaignsConfig$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, params, corporate]) => {
        const { uuid } = corporate;
        return this.campaignsService.getCampaigns(params, uuid).pipe(
          map((data: ICampaigns.IData) =>
            CampaignsActions.LoadCampaignsSuccess({
              campaigns: data.docs,
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
              CampaignsActions.LoadCampaignsFail({
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

  uploadCampaignContentImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.UploadCampaignContentImage.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([file, { uuid: corporateUuid }]) => {
        const object: IUpload.IUploadImage = {
          corporateUuid,
          folder: IUpload.HTML_UPLOAD_FOLDERS.CAMPAIGN,
          file,
        };

        return this.sharedService.uploadAttachment(object).pipe(
          map((url: string) =>
            CampaignsActions.UploadCampaignContentImageSuccess({
              payload: url,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.UploadCampaignContentImageFail({
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

  handleUploadCampaignContentImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.UploadCampaignContentImageFail.type),
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

  activateCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.ActivateCampaign.type),
      map((action) => action.payload),
      switchMap((campaign: ICampaigns.IDocument) => {
        return this.campaignsService.activateCampaign(campaign).pipe(
          map(() =>
            CampaignsActions.ActivateCampaignsSuccess({
              payload: {
                id: campaign.uuid,
                changes: {
                  name: campaign.name,
                  active: !campaign.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.ActivateCampaignFail({
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

  handleActivateCampaignsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.ActivateCampaignsSuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateCampaignFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.ActivateCampaignFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => CampaignsActions.LoadCampaigns())
      )
  );

  deactivateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.DeactivateCampaign.type),
      map((action) => action.payload),
      switchMap((campaign: ICampaigns.IDocument) => {
        return this.campaignsService.deactivateCampaign(campaign).pipe(
          map(() =>
            CampaignsActions.DeactivateCampaignSuccess({
              payload: {
                id: campaign.uuid,
                changes: {
                  name: campaign.name,
                  active: !campaign.active,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.DeactivateCampaignFail({
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

  handleDeactivateCampaignSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.DeactivateCampaignSuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateCampaignFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.DeactivateCampaignFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => CampaignsActions.LoadCampaigns())
      )
  );

  sendCampaignPushNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.SendCampaignPushNotification.type),
      map((action) => action.payload),
      switchMap((campaign: ICampaigns.IDocument) => {
        return this.campaignsService
          .sendCampaignPushNotification(campaign)
          .pipe(
            map((data) =>
              CampaignsActions.SendCampaignPushNotificationSuccess({
                payload: data,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CampaignsActions.SendCampaignPushNotificationFail({
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

  handleSendCampaignPushNotificationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.SendCampaignPushNotificationSuccess.type),
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

  handleSendCampaignPushNotificationFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.SendCampaignPushNotificationFail.type),
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

  createCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.CreateCampaign.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.campaignsService.createCampaign(payload).pipe(
          map((campaign: ICampaigns.IDocument) => {
            return CampaignsActions.CreateCampaignSuccess({
              payload: campaign,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.CreateCampaignFail({
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

  handleCreateCampaignSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.CreateCampaignSuccess.type),
      map((action) => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/marketing/campaigns`],
          },
        });
      })
    )
  );

  handleCreateCampaignFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.CreateCampaignFail.type),
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

  updateCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.UpdateCampaign.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.campaignsService.updateCampaign(payload).pipe(
          map((campaign: ICampaigns.IDocument) => {
            return CampaignsActions.UpdateCampaignSuccess({
              payload: {
                id: campaign.uuid,
                changes: campaign,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.UpdateCampaignFail({
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

  handleUpdateCampaignSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.UpdateCampaignSuccess.type),
      map((action) => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/marketing/campaigns`],
          },
        });
      })
    )
  );

  handleUpdateCampaignFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.UpdateCampaignFail.type),
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

  getCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.GetCampaign.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.campaignsService.getCampaign(payload).pipe(
          map((campaign: ICampaigns.IDocument) => {
            return CampaignsActions.GetCampaignSuccess({
              payload: campaign,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.GetCampaignFail({
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

  handleGetCampaignFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.GetCampaignFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => CampaignsActions.RedirectToCampaigns())
    )
  );

  handleRedirectToCampaigns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.RedirectToCampaigns.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketing/campaigns'],
          },
        });
      })
    )
  );

  onFeatureCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.OnFeatureCampaign.type),
      map((action) => action.payload),
      switchMap((campaign: ICampaigns.IDocument) => {
        return this.campaignsService.onFeatureCampaign(campaign).pipe(
          map(() =>
            CampaignsActions.OnFeatureCampaignsSuccess({
              payload: {
                id: campaign.uuid,
                changes: {
                  name: campaign.name,
                  isFeatured: !campaign.isFeatured,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.OnFeatureCampaignFail({
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

  handleOnFeatureCampaignsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.OnFeatureCampaignsSuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} feature has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleOnFeatureCampaignFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.OnFeatureCampaignFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => CampaignsActions.LoadCampaigns())
      )
  );

  offFeatureCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignsActions.OffFeatureCampaign.type),
      map((action) => action.payload),
      switchMap((campaign: ICampaigns.IDocument) => {
        return this.campaignsService.offFeatureCampaign(campaign).pipe(
          map(() =>
            CampaignsActions.OffFeatureCampaignSuccess({
              payload: {
                id: campaign.uuid,
                changes: {
                  name: campaign.name,
                  isFeatured: !campaign.isFeatured,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignsActions.OffFeatureCampaignFail({
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

  handleOffFeatureCampaignSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.DeactivateCampaignSuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} feature has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleOffFeatureCampaignFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignsActions.OffFeatureCampaignFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => CampaignsActions.LoadCampaigns())
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
