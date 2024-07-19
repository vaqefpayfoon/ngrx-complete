import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { ServicesActions } from '../actions';

// Services
import { ServicesService } from '../../services';

// Models
import { IServices } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { ServicesFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class ServicesEffects {
  constructor(
    private actions$: Actions<ServicesActions.ServicesActionsUnion>,
    private servicesService: ServicesService,
    private authFacade: AuthFacade,
    private servicesFacade: ServicesFacade,
    private snackBar: MatSnackBar
  ) {}

  selectCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.SelectCategory.type),
      map(() => {
        return ServicesActions.LoadServices();
      })
    )
  );

  loadServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.LoadServices.type),
      withLatestFrom(
        this.authFacade.selectedBranch,
        this.servicesFacade.category$
      ),
      switchMap(([_, branch, category]) => {
        const { uuid } = branch;

        return this.servicesService.getServices(uuid, category).pipe(
          map((services: IServices.IDocument[]) =>
            ServicesActions.LoadServicesSuccess({
              payload: services
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(ServicesActions.LoadServicesFail({ payload: message }));
          })
        );
      })
    )
  );

  getService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.GetService.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.servicesService.getService(payload).pipe(
          map((data: IServices.IDocument) =>
            ServicesActions.GetServiceSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServicesActions.GetServiceFail({
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

  activateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.ActivateService.type),
      map(action => action.payload),
      switchMap((service: IServices.IDocument) => {
        return this.servicesService.activateService(service).pipe(
          map(() =>
            ServicesActions.ActivateServiceSuccess({
              payload: {
                id: service.uuid,
                changes: {
                  title: service.title,
                  isActive: !service.isActive
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServicesActions.ActivateServiceFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleActivateServiceFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.ActivateServiceFail.type),
      map(action => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      })
    ), {
      dispatch: false
    }
  );

  deactivateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.DeactivateService.type),
      map(action => action.payload),
      switchMap((service: IServices.IDocument) => {
        return this.servicesService.deactivateService(service).pipe(
          map(() =>
            ServicesActions.DeactivateServiceSuccess({
              payload: {
                id: service.uuid,
                changes: {
                  title: service.title,
                  isActive: !service.isActive
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              ServicesActions.DeactivateServiceFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleDeactivateServiceFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.DeactivateServiceFail.type),
      map(action => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      })
    ), {
      dispatch: false
    }
  );

  createService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.CreateService.type),
      map(action => action.payload),
      switchMap((payload: IServices.ICreate) => {
        return this.servicesService.createService(payload).pipe(
          map((service: IServices.IDocument) => {
            return ServicesActions.CreateServiceSuccess({
              payload: service
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(ServicesActions.CreateServiceFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateServiceFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.CreateServiceFail.type),
      map(action => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      })
    ), {
      dispatch: false
    }
  );

  updateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.UpdateService.type),
      map(action => action.payload),
      switchMap((payload: IServices.IDocument) => {
        return this.servicesService.updateService(payload).pipe(
          map((service: IServices.IDocument) => {
            return ServicesActions.UpdateServiceSuccess({
              payload: {
                id: service.uuid,
                changes: service
              }
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(ServicesActions.UpdateServiceFail({ payload: message }));
          })
        );
      })
    )
  );

  handleGetServiceFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ServicesActions.GetServiceFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => ServicesActions.RedirectToServices())
      )
  );

  handleRedirectToServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.RedirectToServices.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/services/list'],
          },
        });
      })
    )
  );

  handleUpdateServiceFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.UpdateServiceFail.type),
      map(action => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      })
    ), {
      dispatch: false
    }
  );

  handleCreateServiceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.CreateServiceSuccess.type),
      map(action => {
        const { title } = action.payload;
        this.toggleSnackbar(`${title} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/services/list']
          }
        });
      })
    )
  );

  handleUpdateServiceSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.UpdateServiceSuccess.type),
      map(action => {
        const { title } = action.payload.changes;
        this.toggleSnackbar(`${title} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/services/list']
          }
        });
      })
    )
  );

  handleGoToServicesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.GoToServicesList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/services/list']
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
