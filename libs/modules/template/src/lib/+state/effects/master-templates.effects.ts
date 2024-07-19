import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { MasterTemplatesActions } from '../actions';

// Services
import { TemplateService } from '../../services';

// Models
import { ITemplates } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { MasterTemplatesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class MasterTemplatesEffects {
  constructor(
    private actions$: Actions<
      MasterTemplatesActions.MasterTemplatesActionsUnion
    >,
    private templateService: TemplateService,
    private templatesFacade: MasterTemplatesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setMasterTemplatesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.SetMasterTemplatesPage.type),
      map(() => MasterTemplatesActions.LoadMasterTemplates())
    )
  );

  loadMasterTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.LoadMasterTemplates.type),
      withLatestFrom(
        this.templatesFacade.templatesConfig$,
        this.templatesFacade.templatesFilter$,
      ),
      switchMap(([_, config, filters]) => {

        const filterParams = [...filters];

        return this.templateService.getTemplates(config, filterParams).pipe(
          map((data: ITemplates.IData) =>
            MasterTemplatesActions.LoadMasterTemplatesSuccess({
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
              MasterTemplatesActions.LoadMasterTemplatesFail({
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

  createMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.CreateMasterTemplate.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.templateService.createMasterTemplate(payload).pipe(
          map((templates: ITemplates.IDocument) => {
            return MasterTemplatesActions.CreateMasterTemplateSuccess({
              payload: templates
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              MasterTemplatesActions.CreateMasterTemplateFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleCreateMasterTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.CreateMasterTemplateSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/master`]
          }
        });
      })
    )
  );

  handleCreateMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.CreateMasterTemplateFail.type),
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

  getMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.GetMasterTemplate.type),
      map(action => action.payload),
      switchMap(uuid => {
        return this.templateService.getTemplate(uuid).pipe(
          map((payload: ITemplates.IDocument) => {
            return MasterTemplatesActions.GetMasterTemplateSuccess({
              payload
            });
          }),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              MasterTemplatesActions.GetMasterTemplateFail({
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

  handleGetMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.GetMasterTemplateFail.type),
        map(action => {
          const { message } = action.payload;
          return this.toggleSnackbar(message);
        }),
        map(() => MasterTemplatesActions.RedirectToMasterTemplates())
      )
  );

  handleRedirectToMasterTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.RedirectToMasterTemplates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/configuration/templates/master'],
          },
        });
      })
    )
  );

  activateMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.ActivateMasterTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.activateTemplate(template).pipe(
          map(() =>
            MasterTemplatesActions.ActivateMasterTemplatesSuccess({
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
              MasterTemplatesActions.ActivateMasterTemplateFail({
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

  handleActivateMasterTemplatesSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.ActivateMasterTemplatesSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.ActivateMasterTemplateFail.type),
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

  deactivateMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.DeactivateMasterTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deactivateTemplate(template).pipe(
          map(() =>
            MasterTemplatesActions.DeactivateMasterTemplateSuccess({
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
              MasterTemplatesActions.DeactivateMasterTemplateFail({
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

  handleDeactivateMasterTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.DeactivateMasterTemplateSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.DeactivateMasterTemplateFail.type),
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

  updateMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.UpdateMasterTemplate.type),
      map(action => action.payload),
      switchMap(document => {
        return this.templateService.updateTemplate(document).pipe(
          map((template: ITemplates.IUpdate) => {
            return MasterTemplatesActions.UpdateMasterTemplateSuccess({
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
              MasterTemplatesActions.UpdateMasterTemplateFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleUpdateMasterTemplateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.UpdateMasterTemplateSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/configuration/templates/master`]
          }
        });
      })
    )
  );

  handleUpdateMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.UpdateMasterTemplateFail.type),
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

  deletetMasterTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterTemplatesActions.DeletetMasterTemplate.type),
      map(action => action.payload),
      switchMap((template: ITemplates.IDocument) => {
        return this.templateService.deleteTemplate(template).pipe(
          map(() =>
            MasterTemplatesActions.DeletetMasterTemplateSuccess({
              payload: template
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              MasterTemplatesActions.DeletetMasterTemplateFail({
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

  handleDeletetMasterTemplateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.DeletetMasterTemplateSuccess.type),
        map(action => {
          const { name } = action.payload;
          return this.toggleSnackbar(`${name} has been deleted.`);
        })
      ),
    { dispatch: false }
  );

  handleDeleteMasterTemplateFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MasterTemplatesActions.DeletetMasterTemplateFail.type),
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

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
