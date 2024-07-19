import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { EmailTemplatesActions } from '../actions';

// Services
import { TemplateService } from '../../services';

// Models
import { ITemplates } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { EmailTemplatesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';
import { IUpload, SharedService } from '@neural/ui';

@Injectable()
export class EmailTemplatesEffects {
  constructor(
    private actions$: Actions<EmailTemplatesActions.EmailTemplatesActionsUnion>,
    private templateService: TemplateService,
    private sharedService: SharedService,
    private emailTemplatesFacade: EmailTemplatesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setEmailTemplatesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.SetEmailTemplatesPage.type),
      map(() => EmailTemplatesActions.LoadEmailTemplates())
    )
  );

  loadTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.LoadEmailTemplates.type),
      withLatestFrom(
        this.emailTemplatesFacade.templatesConfig$,
        this.emailTemplatesFacade.templatesFilter$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, config, filters, selectedCorporate]) => {
        const { uuid } = selectedCorporate;

        const filterParams = [...filters, { corporateUuid: uuid }];

        return this.templateService.getTemplates(config, filterParams).pipe(
          map((data: ITemplates.IData) =>
            EmailTemplatesActions.LoadEmailTemplatesSuccess({
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
              EmailTemplatesActions.LoadEmailTemplatesFail({
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

  getEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.GetEmailTemplate.type),
      map(action => action.payload),
      switchMap(uuid => {
        return this.templateService.getTemplate(uuid).pipe(
          map((payload: ITemplates.IDocument) => {
            return EmailTemplatesActions.GetEmailTemplateSuccess({
              payload
            });
          }),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              EmailTemplatesActions.GetEmailTemplateFail({
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

  handleGetEmailTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.GetEmailTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => EmailTemplatesActions.RedirectToEmailTemplates())
      ),
  );

  activateEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.ActivateEmailTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.activateTemplate(template).pipe(
          map(() =>
            EmailTemplatesActions.ActivateEmailTemplatesSuccess({
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
              EmailTemplatesActions.ActivateEmailTemplateFail({
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

  handleActivateEmailTemplatesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.ActivateEmailTemplatesSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateEmailTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.ActivateEmailTemplateFail.type),
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

  deactivateEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.DeactivateEmailTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deactivateTemplate(template).pipe(
          map(() =>
            EmailTemplatesActions.DeactivateEmailTemplateSuccess({
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
              EmailTemplatesActions.DeactivateEmailTemplateFail({
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

  handleDeactivateEmailTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.DeactivateEmailTemplateSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateEmailTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.DeactivateEmailTemplateFail.type),
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

  createEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.CreateEmailTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return EmailTemplatesActions.CreateEmailTemplateSuccess({
              payload: templates
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              EmailTemplatesActions.CreateEmailTemplateFail({
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

  handleCreateEmailTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.CreateEmailTemplateSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/email`]
          }
        });
      })
    )
  );

  handleCreateEmailTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.CreateEmailTemplateFail.type),
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

  createEmailFromMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.CreateEmailFromMasterTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createFromMasterTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return EmailTemplatesActions.CreateEmailFromMasterTemplateSuccess({
              payload: templates
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              EmailTemplatesActions.CreateEmailFromMasterTemplateFail({
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

  handleCreateEmailFromMasterTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.CreateEmailFromMasterTemplateSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/email`]
          }
        });
      })
    )
  );

  handleCreateEmailFromMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.CreateEmailFromMasterTemplateFail.type),
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

  updateEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.UpdateEmailTemplate.type),
      map(action => action.payload),
      switchMap(document => {
        return this.templateService.updateTemplate(document).pipe(
          map((template: ITemplates.IUpdate) => {
            return EmailTemplatesActions.UpdateEmailTemplateSuccess({
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
              EmailTemplatesActions.UpdateEmailTemplateFail({
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

  handleUpdateEmailTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.UpdateEmailTemplateSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/email`]
          }
        });
      })
    )
  );

  handleUpdateEmailTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.UpdateEmailTemplateFail.type),
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

  deletetEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.DeletetEmailTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deleteTemplate(template).pipe(
          map(() =>
            EmailTemplatesActions.DeletetEmailTemplateSuccess({
              payload: template
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              EmailTemplatesActions.DeletetEmailTemplateFail({
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

  handleDeletetEmailTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.DeletetEmailTemplateSuccess.type),
        map(action => {
          const { name } = action.payload;
          return this.toggleSnackbar(`${name} has been deleted.`);
        })
      ),
    { dispatch: false }
  );

  handleDeleteEmailTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.DeletetEmailTemplateFail.type),
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

  uploadEmailTemplateImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.UploadEmailTemplateImage.type),
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
            EmailTemplatesActions.UploadEmailTemplateImageSuccess({
              payload: url,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              EmailTemplatesActions.UploadEmailTemplateImageFail({
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

  handleUploadEmailTemplateImageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmailTemplatesActions.UploadEmailTemplateImageFail.type),
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

  redirectToEmailTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailTemplatesActions.RedirectToEmailTemplates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/email`]
          }
        });
      })
    )
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
