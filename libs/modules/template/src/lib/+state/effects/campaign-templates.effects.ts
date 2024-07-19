import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CampaignTemplatesActions } from '../actions';

// Services
import { TemplateService } from '../../services';

// Models
import { ITemplates } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { CampaignTemplatesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';
import { IUpload, SharedService } from '@neural/ui';

@Injectable()
export class CampaignTemplatesEffects {
  constructor(
    private actions$: Actions<
      CampaignTemplatesActions.CampaignTemplatesActionsUnion
    >,
    private templateService: TemplateService,
    private sharedService: SharedService,
    private campaignTemplatesFacade: CampaignTemplatesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setCampaignTemplatesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.SetCampaignTemplatesPage.type),
      map(() => CampaignTemplatesActions.LoadCampaignTemplates())
    )
  );

  loadTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.LoadCampaignTemplates.type),
      withLatestFrom(
        this.campaignTemplatesFacade.templatesConfig$,
        this.campaignTemplatesFacade.templatesFilter$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, config, filters, selectedCorporate]) => {
        const { uuid } = selectedCorporate;

        const filterParams = [...filters, { corporateUuid: uuid }];

        return this.templateService.getTemplates(config, filterParams).pipe(
          map((data: ITemplates.IData) =>
            CampaignTemplatesActions.LoadCampaignTemplatesSuccess({
              templates: data.docs,
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
              CampaignTemplatesActions.LoadCampaignTemplatesFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  getCampaignTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.GetCampaignTemplate.type),
      map(action => action.payload),
      switchMap(uuid => {
        return this.templateService.getTemplate(uuid).pipe(
          map((payload: ITemplates.IDocument) => {
            return CampaignTemplatesActions.GetCampaignTemplateSuccess({
              payload
            });
          }),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.GetCampaignTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleGetCampaignTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.GetCampaignTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => CampaignTemplatesActions.RedirectToCampaignTemplates())
      )
  );

  handleRedirectToCampaignTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.RedirectToCampaignTemplates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/configuration/templates/campaign'],
          },
        });
      })
    )
  );

  activateCampaignTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.ActivateCampaignTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.activateTemplate(template).pipe(
          map(() =>
            CampaignTemplatesActions.ActivateCampaignTemplatesSuccess({
              payload: {
                id: template.uuid,
                changes: {
                  active: !template.active,
                  name: template.name
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.ActivateCampaignTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleActivateCampaignTemplatesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.ActivateCampaignTemplatesSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateCampaignTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.ActivateCampaignTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  deactivateCampaignTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.DeactivateCampaignTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deactivateTemplate(template).pipe(
          map(() =>
            CampaignTemplatesActions.DeactivateCampaignTemplateSuccess({
              payload: {
                id: template.uuid,
                changes: {
                  active: !template.active,
                  name: template.name
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.DeactivateCampaignTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleDeactivateCampaignTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.DeactivateCampaignTemplateSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateCampaignTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.DeactivateCampaignTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  createCampaignTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.CreateCampaignTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return CampaignTemplatesActions.CreateCampaignTemplateSuccess({
              payload: templates
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.CreateCampaignTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleCreateCampaignTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.CreateCampaignTemplateSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/campaign`]
          }
        });
      })
    )
  );

  handleCreateCampaignTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.CreateCampaignTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  createCampaignFromMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.CreateCampaignFromMasterTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createFromMasterTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return CampaignTemplatesActions.CreateCampaignFromMasterTemplateSuccess(
              {
                payload: templates
              }
            );
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.CreateCampaignFromMasterTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleCreateCampaignFromMasterTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CampaignTemplatesActions.CreateCampaignFromMasterTemplateSuccess.type
      ),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/campaign`]
          }
        });
      })
    )
  );

  handleCreateCampaignFromMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CampaignTemplatesActions.CreateCampaignFromMasterTemplateFail.type
        ),
        map(action => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  updateCampaignTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.UpdateCampaignTemplate.type),
      map(action => action.payload),
      switchMap(document => {
        return this.templateService.updateTemplate(document).pipe(
          map((template: ITemplates.IUpdate) => {
            return CampaignTemplatesActions.UpdateCampaignTemplateSuccess({
              payload: {
                id: template.uuid,
                changes: template
              }
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.UpdateCampaignTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleUpdateCampaignTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.UpdateCampaignTemplateSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/campaign`]
          }
        });
      })
    )
  );

  handleUpdateCampaignTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.UpdateCampaignTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  deletetCampaignTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.DeletetCampaignTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deleteTemplate(template).pipe(
          map(() =>
            CampaignTemplatesActions.DeletetCampaignTemplateSuccess({
              payload: template
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.DeletetCampaignTemplateFail({
                payload: {
                  status: res.status,
                  message
                }
              })
            );
          })
        );
      })
    )
  );

  handleDeletetCampaignTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.DeletetCampaignTemplateSuccess.type),
        map(action => {
          const { name } = action.payload;
          return this.toggleSnackbar(`${name} has been deleted.`);
        })
      ),
    { dispatch: false }
  );

  handleDeleteCampaignTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.DeletetCampaignTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  uploadCampaignTemplateImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTemplatesActions.UploadCampaignTemplateImage.type),
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
            CampaignTemplatesActions.UploadCampaignTemplateImageSuccess({
              payload: url,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CampaignTemplatesActions.UploadCampaignTemplateImageFail({
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

  handleUploadCampaignTemplateImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CampaignTemplatesActions.UploadCampaignTemplateImageFail.type),
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

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
