import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { BranchesActions, OffDaysActions } from '../actions';

// Services
import { BranchesService } from '../../services';

// Models
import { IBranches } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';
import { Store } from '@ngrx/store';
import { AuthFacade } from '@neural/auth';

@Injectable()
export class BranchEffects {
  constructor(
    private actions$: Actions<BranchesActions.BranchesActionsUnion>,
    private branchesService: BranchesService,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private authFacade: AuthFacade
  ) {}

  loadBranches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.LoadBranches.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.getBranches(payload).pipe(
          map((branches: IBranches.IDocument[]) =>
            BranchesActions.LoadBranchesSuccess({ payload: branches })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(BranchesActions.LoadBranchesFail({ payload: message }));
          })
        );
      })
    )
  );

  getBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.GetBranch.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.getBranch(payload).pipe(
          map((branch: IBranches.IDocument) =>
            BranchesActions.GetBranchSuccess({
              payload: branch,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(BranchesActions.GetBranchFail({ payload: message }));
          })
        );
      })
    )
  );

  handleGetBranchFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.GetBranchFail.type),
      map((action) => {
        const { payload } = action;
        return this.toggleSnackbar(payload);
      }),
      map(() => BranchesActions.RedirectToCorporates())
    )
  );

  handleRedirectToCorporates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.RedirectToCorporates.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/corporates'],
          },
        });
      })
    )
  );

  createBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateBranch.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.createBranch(payload).pipe(
          map((corporate: IBranches.IDocument) => {
            return BranchesActions.CreateBranchSuccess({
              payload: corporate,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(BranchesActions.CreateBranchFail({ payload: message }));
          })
        );
      })
    )
  );

  handleCreateBranchSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateBranchSuccess.type),
      map((action) => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created`);
        return action.payload;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/customer/corporates/branches`],
          },
        });
      })
    )
  );

  updateBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateBranch.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.updateBranch(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.UpdateBranchSuccess({
              payload: {
                id: branch.uuid,
                changes: branch,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(BranchesActions.UpdateBranchFail({ payload: message }));
          })
        );
      })
    )
  );

  handleUpdateBranchSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateBranchSuccess.type),
      map((action) => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated`);
        return action.payload.changes;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/customer/corporates/branches`],
          },
        });
      })
    )
  );

  handleCreateBranchFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BranchesActions.CreateBranchFail.type),
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

  handleUpdateBranchFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BranchesActions.UpdateBranchFail.type),
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

  loadCountryNames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.LoadCountryNames.type),
      switchMap(() => {
        return this.branchesService.getCountryNames().pipe(
          map((countries: string[]) =>
            BranchesActions.LoadCountryNamesSuccess({ payload: countries })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BranchesActions.LoadCountryNamesFail({ payload: message })
            );
          })
        );
      })
    )
  );

  getCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.GetCountry.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.getCountryByName(payload).pipe(
          map((country: IBranches.IGetCountry) =>
            BranchesActions.GetCountrySuccess({ payload: country })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(BranchesActions.GetCountryFail({ payload: message }));
          })
        );
      })
    )
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }

  createSchedulerBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateSchedular.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.createBranchSchedules(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.CreateSchedularSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(BranchesActions.CreateSchedularFail({ payload: res }));
          })
        );
      })
    )
  );

  handleCreateSchedularSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateSchedularSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Scheduler has been created`);
        return action.payload;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${branch.corporateUuid}/${branch.uuid}/schedules`,
            ],
          },
        });
      })
    )
  );

  updateSchedulerBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateSchedular.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.updateBranchSchedules(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.UpdateSchedularSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(BranchesActions.UpdateSchedularFail({ payload: res }));
          })
        );
      })
    )
  );

  handleUpdateSchedularSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateSchedularSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Scheduler has been updated`);
        return action.payload;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${branch.corporateUuid}/${branch.uuid}/schedules`,
            ],
          },
        });
      })
    )
  );

  deleteSchedulerBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.DeleteSchedular.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.deleteBranchSchedules(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.DeleteSchedularSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(BranchesActions.DeleteSchedularFail({ payload: res }));
          })
        );
      })
    )
  );

  deleteSchedularSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.DeleteSchedularSuccess.type),
      map((action) => {
        this.toggleSnackbar(`scheduler has been deleted`);
        return action.payload;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${branch.corporateUuid}/${branch.uuid}/schedules`,
            ],
          },
        });
      })
    )
  );

  createSchedulerTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateSchedularTeam.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.createScheduleTeam(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.CreateSchedularTeamSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(
              BranchesActions.CreateSchedularTeamFail({ payload: res })
            );
          })
        );
      })
    )
  );

  handleCreateSchedularTeamSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateSchedularTeamSuccess.type),
      withLatestFrom(
        this.store.select(fromRoot.getRouterState),
        (action, router) => {
          return {
            id: router.state.params.scheduleUuid,
            payload: action.payload,
          };
        }
      ),
      map((action) => {
        this.toggleSnackbar(`Team has been created`);
        return action;
      }),
      map((action) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${action.payload.corporateUuid}/${action.payload.uuid}/schedules/${action.id}`,
            ],
          },
        });
      })
    )
  );

  handleCreateSchedularTeam$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BranchesActions.CreateSchedularTeamFail.type),
        map((action) => {
          const message = action.payload?.error?.response?.message;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  updateSchedulerTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateSchedularTeam.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.updateScheduleTeam(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.UpdateSchedularTeamSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(
              BranchesActions.UpdateSchedularTeamFail({ payload: res })
            );
          })
        );
      })
    )
  );

  handleUpdateSchedularTeamSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateSchedularTeamSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Team has been updated`);
        return action.payload;
      }),
      // map((branch) => {
      //   return fromRoot.RouterActions.Back();
      // }),
      withLatestFrom(
        this.store.select(fromRoot.getRouterState),
        (action, router) => {
          return {
            id: router.state.params.scheduleUuid,
            uuid: router.state.params.uuid,
            cUuid: router.state.params.cUuid,
            teamUuid: router.state.params.teamUuid,
          };
        }
      ),
      map((action) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${action.cUuid}/${action.uuid}/schedules/${action.id}/${action.teamUuid}`,
            ],
          },
        });
      })
    )
  );

  handleUpdateSchedularTeam$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BranchesActions.UpdateSchedularTeamFail.type),
        map((action) => {
          const message = action.payload?.error?.response?.message;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  deleteSchedulerTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.DeleteSchedularTeam.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.deleteScheduleTeam(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.DeleteSchedularTeamSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(
              BranchesActions.DeleteSchedularTeamFail({ payload: res })
            );
          })
        );
      })
    )
  );

  deleteSchedularTeamSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.DeleteSchedularTeamSuccess.type),
      withLatestFrom(
        this.store.select(fromRoot.getRouterState),
        (action, router) => {
          return {
            id: router.state.params.scheduleUuid,
            payload: action.payload,
          };
        }
      ),
      map((action) => {
        this.toggleSnackbar(`Team has been deleted`);
        return action;
      }),
      map((action) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${action.payload.corporateUuid}/${action.payload.uuid}/schedules/${action.id}`,
            ],
          },
        });
      })
    )
  );

  handleRedirectToTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.RedirectToTeams.type),
      withLatestFrom(
        this.store.select(fromRoot.getRouterState),
        (action, router) => {
          return {
            id: router.state.params.scheduleUuid,
            uuid: router.state.params.uuid,
            cUuid: router.state.params.cUuid,
          };
        }
      ),
      map((action) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${action.cUuid}/${action.uuid}/schedules/${action.id}`,
            ],
          },
        });
      })
    )
  );

  handleCreateSchedulesOffDaysFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BranchesActions.CreateSchedulesOffDaysFail.type),
        map((action) => {
          const message = action.payload?.error?.response?.message;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleUpdateSchedulesOffDaysFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BranchesActions.UpdateSchedulesOffDaysFail.type),
        map((action) => {
          const message = action.payload?.error?.response?.message;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  createSchedulesOffDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateSchedulesOffDays.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.createScheduleOffDays(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.CreateSchedulesOffDaysSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(
              BranchesActions.CreateSchedulesOffDaysFail({ payload: res })
            );
          })
        );
      })
    )
  );

  handleCreateSchedulesOffDaysSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.CreateSchedulesOffDaysSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Branch Schedules OffDays Created - Success!`);
        return action.payload;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Back();
      })
    )
  );

  updateSchedulesOffDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateSchedulesOffDays.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.updateScheduleOffDays(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return BranchesActions.UpdateSchedulesOffDaysSuccess({
              payload: branch,
            });
          }),
          catchError((res: any) => {
            return of(
              BranchesActions.UpdateSchedulesOffDaysFail({ payload: res })
            );
          })
        );
      })
    )
  );

  handleUpdateSchedulesOffDaysSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.UpdateSchedulesOffDaysSuccess.type),
      map((action) => {
        this.toggleSnackbar(`Branch Schedules OffDays Updated - Success!`);
        return action.payload;
      }),
      map((branch) => {
        return fromRoot.RouterActions.Back();
      })
    )
  );

  handleRedirectToOffDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.RedirectToOffDays.type),
      withLatestFrom(
        this.store.select(fromRoot.getRouterState),
        (action, router) => {
          return {
            id: router.state.params.scheduleUuid,
            uuid: router.state.params.uuid,
            cUuid: router.state.params.cUuid,
          };
        }
      ),
      map((action) => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/branches/${action.cUuid}/${action.uuid}/schedules`,
            ],
          },
        });
      })
    )
  );

  deleteSchedulerOffDays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchesActions.DeleteSchedularOffDays.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.branchesService.deleteScheduleOffDays(payload).pipe(
          map((branch: IBranches.IDocument) => {
            return OffDaysActions.loadOffDaysList({
              payload: branch.uuid,
            });
          }),
          catchError((res: any) => {
            return of(
              BranchesActions.DeleteSchedularOffDaysFail({ payload: res })
            );
          })
        );
      })
    )
  );
  
}
