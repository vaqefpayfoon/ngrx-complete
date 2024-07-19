import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { InboxTemplatesActions } from '../actions';

// Services
import { TemplateService } from '../../services';

// Models
import { ITemplates } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { InboxTemplatesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';
import { IUpload, SharedService } from '@neural/ui';

@Injectable()
export class InboxTemplatesEffects {
  constructor(
    private actions$: Actions<InboxTemplatesActions.InboxTemplatesActionsUnion>,
    private templateService: TemplateService,
    private sharedService: SharedService,
    private inboxlTemplatesFacade: InboxTemplatesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setInboxTemplatesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.SetInboxTemplatesPage.type),
      map(() => InboxTemplatesActions.LoadInboxTemplates())
    )
  );

  loadTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.LoadInboxTemplates.type),
      withLatestFrom(
        this.inboxlTemplatesFacade.templatesConfig$,
        this.inboxlTemplatesFacade.templatesFilter$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, config, filters, selectedCorporate]) => {
        const { uuid } = selectedCorporate;

        const filterParams = [...filters, { corporateUuid: uuid }];

        return this.templateService.getTemplates(config, filterParams).pipe(
          map((data: ITemplates.IData) =>
            InboxTemplatesActions.LoadInboxTemplatesSuccess({
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
              InboxTemplatesActions.LoadInboxTemplatesFail({
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

  getInboxTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.GetInboxTemplate.type),
      map(action => action.payload),
      switchMap(uuid => {
        return this.templateService.getTemplate(uuid).pipe(
          map((payload: ITemplates.IDocument) => {
            return InboxTemplatesActions.GetInboxTemplateSuccess({
              payload
            });
          }),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxTemplatesActions.GetInboxTemplateFail({
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

  handleGetInboxTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.GetInboxTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => InboxTemplatesActions.RedirectToInboxTemplates())
      )
  );

  handleRedirectToInboxTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.RedirectToInboxTemplates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/configuration/templates/inbox'],
          },
        });
      })
    )
  );

  activateInboxTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.ActivateInboxTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.activateTemplate(template).pipe(
          map(() =>
            InboxTemplatesActions.ActivateInboxTemplatesSuccess({
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
              InboxTemplatesActions.ActivateInboxTemplateFail({
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

  handleActivateInboxTemplatesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.ActivateInboxTemplatesSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateInboxTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.ActivateInboxTemplateFail.type),
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

  deactivateInboxTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.DeactivateInboxTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deactivateTemplate(template).pipe(
          map(() =>
            InboxTemplatesActions.DeactivateInboxTemplateSuccess({
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
              InboxTemplatesActions.DeactivateInboxTemplateFail({
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

  handleDeactivateInboxTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.DeactivateInboxTemplateSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateInboxTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.DeactivateInboxTemplateFail.type),
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

  createInboxTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.CreateInboxTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return InboxTemplatesActions.CreateInboxTemplateSuccess({
              payload: templates
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxTemplatesActions.CreateInboxTemplateFail({
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

  handleCreateInboxTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.CreateInboxTemplateSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/inbox`]
          }
        });
      })
    )
  );

  handleCreateInboxTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.CreateInboxTemplateFail.type),
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

  createInboxFromMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.CreateInboxFromMasterTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createFromMasterTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return InboxTemplatesActions.CreateInboxFromMasterTemplateSuccess({
              payload: templates
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxTemplatesActions.CreateInboxFromMasterTemplateFail({
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

  handleCreateInboxFromMasterTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.CreateInboxFromMasterTemplateSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/inbox`]
          }
        });
      })
    )
  );

  handleCreateInboxFromMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.CreateInboxFromMasterTemplateFail.type),
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

  updateInboxTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.UpdateInboxTemplate.type),
      map(action => action.payload),
      switchMap(document => {
        return this.templateService.updateTemplate(document).pipe(
          map((template: ITemplates.IUpdate) => {
            return InboxTemplatesActions.UpdateInboxTemplateSuccess({
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
              InboxTemplatesActions.UpdateInboxTemplateFail({
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

  handleUpdateInboxTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.UpdateInboxTemplateSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/inbox`]
          }
        });
      })
    )
  );

  handleUpdateInboxTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.UpdateInboxTemplateFail.type),
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

  deletetInboxTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.DeletetInboxTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deleteTemplate(template).pipe(
          map(() =>
            InboxTemplatesActions.DeletetInboxTemplateSuccess({
              payload: template
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxTemplatesActions.DeletetInboxTemplateFail({
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

  handleDeletetInboxTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.DeletetInboxTemplateSuccess.type),
        map(action => {
          const { name } = action.payload;
          return this.toggleSnackbar(`${name} has been deleted.`);
        })
      ),
    { dispatch: false }
  );

  handleDeleteInboxTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.DeletetInboxTemplateFail.type),
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

  uploadInboxTemplateImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxTemplatesActions.UploadInboxTemplateImage.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([file, { uuid: corporateUuid }]) => {
        const object: IUpload.IUploadImage = {
          corporateUuid,
          folder: IUpload.HTML_UPLOAD_FOLDERS.INBOX,
          file,
        };

        return this.sharedService.uploadAttachment(object).pipe(
          map((url: string) =>
            InboxTemplatesActions.UploadInboxTemplateImageSuccess({
              payload: url,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxTemplatesActions.UploadInboxTemplateImageFail({
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

  handleUploadInboxTemplateImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxTemplatesActions.UploadInboxTemplateImageFail.type),
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
