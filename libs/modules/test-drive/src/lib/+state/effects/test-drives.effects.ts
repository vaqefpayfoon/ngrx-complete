import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { TestDrivesActions } from '../actions';

// Services
import { TestDrivesService } from '../../services';

// Models
import { ITestDrives } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { TestDrivesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { Auth, AuthFacade } from '@neural/auth';
import { BranchesService } from 'libs/modules/customer/corporate/src/lib/services';
import { IBranches } from '@neural/modules/customer/corporate';

@Injectable()
export class TestDrivesEffects {
  constructor(
    private actions$: Actions<TestDrivesActions.TestDrivesActionsUnion>,
    private testDrivesService: TestDrivesService,
    private testDrivesFacade: TestDrivesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
    private branchesService: BranchesService
  ) {}

  setTestDrivesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.SetTestDrivesPage.type),
      map(() => TestDrivesActions.LoadTestDrives())
    )
  );

  loadTestDrives$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.LoadTestDrives.type),
      withLatestFrom(
        this.testDrivesFacade.testDrivesConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.authFacade.account$,
        this.testDrivesFacade.sorts$
      ),
      switchMap(([_, params, corporate, branch, account, sorts]) => {
        let filters: ITestDrives.IFilter = {
          ['corporate.uuid']: corporate.uuid,
          ['branch.uuid']: branch.uuid,
        };

        if (
          !!account &&
          !!account?.permissions?.operationRole &&
          (account?.permissions?.operationRole === Auth.OperationRole.SA ||
            account?.permissions?.operationRole ===
              Auth.OperationRole.SALES_ADVISOR)
        ) {
          filters = {
            ...filters,
            ['payload.salesAdvisor.uuid']: account?.uuid
          }
        }

        if (!account?.isSuperAdmin) {
          params = {
            ...params,
            corporateUuid: corporate.uuid,
          };
        }

        return this.testDrivesService
          .getTestDrives(params, filters, sorts)
          .pipe(
            map((data: ITestDrives.IData) =>
              TestDrivesActions.LoadTestDrivesSuccess({
                testDrives: data.docs,
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
                TestDrivesActions.LoadTestDrivesFail({
                  payload: {
                    message,
                    status: res.status,
                  },
                })
              );
            })
          );
      })
    )
  );

  updateTestDrive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.UpdateTestDrive.type),
      map((action) => action.payload),
      switchMap((testDrive: ITestDrives.IDocument) => {
        return this.testDrivesService.updateTestDrive(testDrive).pipe(
          map((doc) =>
            TestDrivesActions.UpdateTestDriveSuccess({
              payload: {
                id: doc.uuid,
                changes: doc,
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TestDrivesActions.UpdateTestDriveFail({
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

  handleUpdateTestDriveFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TestDrivesActions.UpdateTestDriveFail.type),
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

  handleUpdateTestDriveSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.UpdateTestDriveSuccess.type),
      map((action) => {
        const { unit } = action.payload.changes;
        this.toggleSnackbar(
          `${unit?.brand} ${unit?.model} ${unit?.variant} has been updated.`
        );
        return action.payload;
      }),
      map(() => TestDrivesActions.RedirectToTestDrives())
    )
  );

  completeTestDrive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.CompleteTestDrive.type),
      map((action) => action.payload),
      switchMap((testDrive: ITestDrives.IDocument) => {
        return this.testDrivesService.completeTestDrive(testDrive).pipe(
          map(() =>
            TestDrivesActions.CompleteTestDriveSuccess({
              payload: {
                id: testDrive.uuid,
                changes: {
                  ...testDrive,
                  status: ITestDrives.Statuses.COMPLETED,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TestDrivesActions.CompleteTestDriveFail({
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

  handleCompleteTestDriveSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TestDrivesActions.CompleteTestDriveSuccess.type),
        map((action) => {
          const {
            payload: { unit },
          } = action.payload.changes;
          this.toggleSnackbar(
            `${unit?.brand} ${unit?.model} ${unit?.variant} has been completed.`
          );
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCompleteTestDriveFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TestDrivesActions.CompleteTestDriveFail.type),
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

  cancelTestDrive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.CancelTestDrive.type),
      map((action) => action.payload),
      switchMap((testDrive: ITestDrives.IDocument) => {
        return this.testDrivesService.cancelTestDrive(testDrive).pipe(
          map(() =>
            TestDrivesActions.CancelTestDriveSuccess({
              payload: {
                id: testDrive.uuid,
                changes: {
                  ...testDrive,
                  status: ITestDrives.Statuses.CANCELLED,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TestDrivesActions.CancelTestDriveFail({
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

  handleCancelTestDriveSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TestDrivesActions.CancelTestDriveSuccess.type),
        map((action) => {
          const {
            payload: { unit },
          } = action.payload.changes;
          this.toggleSnackbar(
            `${unit?.brand} ${unit?.model} ${unit?.variant} has been cancelled.`
          );
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCancelTestDriveFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TestDrivesActions.CancelTestDriveFail.type),
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

  getSaleAdvisors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.GetTestDriveSaleAdvisors.type),
      withLatestFrom(
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch
      ),
      switchMap(([_, selectedCorporate, selectedBranch]) => {
        const { uuid } = selectedCorporate;

        // todo: remove
        const config: ITestDrives.IConfig = {
          limit: 1000,
          page: 1,
        };

        return this.testDrivesService
          .getSaAccounts(uuid, selectedBranch.uuid, config)
          .pipe(
            map((data: ITestDrives.ISalesAdvisorData) =>
              TestDrivesActions.GetTestDriveSaleAdvisorsSuccess({
                payload: data.docs,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                TestDrivesActions.GetTestDriveSaleAdvisorsFail({
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

  getTestDrive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.GetTestDrive.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.testDrivesService.getTestDrive(payload).pipe(
          map((data: ITestDrives.IDocument) =>
            TestDrivesActions.GetTestDriveSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TestDrivesActions.GetTestDriveFail({
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

  getTestDriveCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.GetTestDriveCalendar.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.testDrivesService.getTestDriveCalendar(payload).pipe(
          map((data: ITestDrives.ITestDriveCalendar[]) =>
            TestDrivesActions.GetTestDriveCalendarSuccess({ payload: data })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TestDrivesActions.GetTestDriveCalendarFail({
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

  getBranch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.GetBranch.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.branchesService.getBranch(payload).pipe(
          map((branch: IBranches.IDocument) =>
          TestDrivesActions.GetBranchSuccess({
              payload: branch
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(TestDrivesActions.GetBranchFail({ payload: message }));
          })
        );
      })
    )
  );

  handleGetTestDriveCalendarFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TestDrivesActions.GetTestDriveCalendarFail.type),
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

  handleGetTestDriveFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.GetTestDriveFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => TestDrivesActions.RedirectToTestDrives())
    )
  );

  handleRedirectToTestDrives$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestDrivesActions.RedirectToTestDrives.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/test-drives'],
          },
        });
      })
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
