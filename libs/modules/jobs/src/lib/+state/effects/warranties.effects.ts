import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { WarrantiesActions } from '../actions';

// Services
import { WarrantyService } from '../../services';

// Models
import { IWarranties } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
import { WarrantiesFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class WarrantiesEffects {
  constructor(
    private actions$: Actions<WarrantiesActions.WarrantiesActionsUnion>,
    private warrantyService: WarrantyService,
    private warrantiesFacade: WarrantiesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setWarrantiesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.SetWarrantiesPage.type),
      map(() => WarrantiesActions.LoadWarranties())
    )
  );

  loadWarranties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.LoadWarranties.type),
      withLatestFrom(this.warrantiesFacade.warrantiesConfig$),
      switchMap(([_, params]) => {
        return this.warrantyService.getWarranties(params).pipe(
          map((data: IWarranties.IData) =>
            WarrantiesActions.LoadWarrantiesSuccess({
              warranties: data.docs,
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
              WarrantiesActions.LoadWarrantiesFail({
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

  getWarranty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.GetWarranty.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.warrantyService.getWarranty(payload).pipe(
          map((data: IWarranties.IDocument) =>
            WarrantiesActions.GetWarrantySuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              WarrantiesActions.GetWarrantyFail({
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

  loadAccountsByVin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.LoadAccountsByVin.type),
      map((action) => action.payload),
      switchMap((vin: IWarranties.IVin) => {
        return this.warrantyService.getVehicleByVIN(vin).pipe(
          map((payload: IWarranties.IDocumentVin) =>
            WarrantiesActions.LoadAccountsByVinSuccess({ payload })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              WarrantiesActions.LoadAccountsByVinFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleGetWarrantyFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.GetWarrantyFail.type),
      map((action) => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => WarrantiesActions.RedirectToWarranties())
    )
  );

  handleRedirectToWarranties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.RedirectToWarranties.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/reminders'],
          },
        });
      })
    )
  );

  handleCreateWarrantySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.CreateWarrantySuccess.type),
      map((action) => {
        const {
          accountVehicle: { numberPlate },
        } = action.payload;
        this.toggleSnackbar(`${numberPlate} has been created.`);
        return action.payload;
      }),
      switchMap(() => [
        WarrantiesActions.ResetAccountsByVinSuccess(),
        fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/reminders'],
          },
        }),
      ])
    )
  );

  handleLoadAccountsByVinFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WarrantiesActions.LoadAccountsByVinFail.type),
        map((action) => {
          this.toggleSnackbar(
            `Vehicle refrence not found. Please type an invalid VIN number`
          );
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  createWarranty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.CreateWarranty.type),
      map((action) => action.payload),
      switchMap(({ warranty, entity }) => {
        return this.warrantyService.createWarranty(warranty, entity).pipe(
          map((payload: IWarranties.IDocument) =>
            WarrantiesActions.CreateWarrantySuccess({ payload })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              WarrantiesActions.CreateWarrantyFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleCreateWarrantyFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WarrantiesActions.CreateWarrantyFail.type),
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

  closeWarranty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.CloseWarranty.type),
      map((action) => action.payload),
      switchMap((entry) => {
        const { form, warranty } = entry;
        return this.warrantyService.closeServiceRecall(form, warranty).pipe(
          map((payload: IWarranties.IDocument) =>
            WarrantiesActions.CloseWarrantySuccess({ payload })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              WarrantiesActions.CloseWarrantyFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleCloseWarrantyFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WarrantiesActions.CloseWarrantyFail.type),
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

  handleGoToWarrantiesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.GoToWarrantiesList.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/reservations/reminders'],
          },
        });
      })
    )
  );

  getGetWarrantyReminderReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WarrantiesActions.GetWarrantyReminderReport.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, corporate]) => {
        return this.warrantyService.warrantyReminderReport(corporate.uuid).pipe(
          map((payload: any) =>
            WarrantiesActions.GetWarrantyReminderReportSuccess({
              payload,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              WarrantiesActions.GetWarrantyReminderReportFail({
                payload: message,
              })
            );
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
}
