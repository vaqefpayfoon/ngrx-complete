import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { FleetsActions } from '../actions';

// Services
import { FleetService } from '../../services';

// Models
import { IFleet } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { FleetFacade } from '../facades';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class FleetEffects {
  constructor(
    private actions$: Actions<FleetsActions.FleetsActionsUnion>,
    private fleetService: FleetService,
    private authFacade: AuthFacade,
    private fleetFacade: FleetFacade,
    private snackBar: MatSnackBar
  ) {}

  setFleetPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.SetFleetsPage.type),
      map(() => FleetsActions.LoadFleets())
    )
  );

  loadFleets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.LoadFleets.type),
      withLatestFrom(
        this.fleetFacade.fleetsConfig$,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, params, branch]) => {
        const config: IFleet.IConfig = {
          limit: params.limit,
          page: params.page
        };

        const branchUuid = branch.uuid;

        return this.fleetService.getFleetes(branchUuid, config).pipe(
          map((data: IFleet.IData) =>
            FleetsActions.LoadFleetsSuccess({
              fleets: data.docs,
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
            return of(FleetsActions.LoadFleetsFail({ payload: message }));
          })
        );
      })
    )
  );

  getFleet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.GetFleet.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.fleetService.getFleet(payload).pipe(
          map((data: IFleet.IDocument) =>
            FleetsActions.GetFleetSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              FleetsActions.GetFleetFail({
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

  activateFleet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.ActivateFleet.type),
      map(action => action.payload),
      switchMap((fleet: IFleet.IDocument) => {
        return this.fleetService.activateFleet(fleet).pipe(
          map(() =>
            FleetsActions.ActivateFleetSuccess({
              payload: {
                id: fleet.uuid,
                changes: {
                  name: fleet.name,
                  active: !fleet.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(FleetsActions.ActivateFleetFail({ payload: message }));
          })
        );
      })
    )
  );

  handleGetFleetFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.GetFleetFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => FleetsActions.RedirectToFleets())
      ),
  );

  handleRedirectToFleets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.RedirectToFleets.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/fleets'],
          },
        });
      })
    )
  );

  handleActivateFleetFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.ActivateFleetFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  deactivateFleet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.DeactivateFleet.type),
      map(action => action.payload),
      switchMap((fleet: IFleet.IDocument) => {
        return this.fleetService.deactivateFleet(fleet).pipe(
          map(() =>
            FleetsActions.DeactivateFleetSuccess({
              payload: {
                id: fleet.uuid,
                changes: {
                  name: fleet.name,
                  active: !fleet.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(FleetsActions.DeactivateFleetFail({ payload: message }));
          })
        );
      })
    )
  );

  handleDeactivateFleetFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.DeactivateFleetFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  createFleet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.CreateFleet.type),
      map(action => action.payload),
      switchMap((payload: IFleet.ICreate) => {
        return this.fleetService.createFleet(payload).pipe(
          map((fleet: IFleet.IDocument) => {
            return FleetsActions.CreateFleetSuccess({
              payload: fleet
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(FleetsActions.CreateFleetFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateFleetFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.CreateFleetFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  updateFleet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.UpdateFleet.type),
      map(action => action.payload),
      switchMap((payload: IFleet.IDocument) => {
        return this.fleetService.updateFleet(payload).pipe(
          map((fleet: IFleet.IDocument) => {
            return FleetsActions.UpdateFleetSuccess({
              payload: {
                id: fleet.uuid,
                changes: fleet
              }
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(FleetsActions.UpdateFleetFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdateFleetFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.UpdateFleetFail.type),
        map(action => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false
    }
  );

  handleActivateFleetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.ActivateFleetSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateFleetSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FleetsActions.DeactivateFleetSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  handleCreateFleetSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.CreateFleetSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/fleets']
          }
        });
      })
    )
  );

  handleUpdateFleetSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.UpdateFleetSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/fleets']
          }
        });
      })
    )
  );

  handleGoToFleetsList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FleetsActions.GoToFleetsList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/fleets']
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
