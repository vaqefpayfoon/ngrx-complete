import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { InsuranceEnquiriesActions } from '../actions';

// Services
import { InsuranceEnquiriesService } from '../../services';

// Models
import { IInsuranceEnquiries } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { InsuranceEnquiriesFacade } from '../facades';

import { AuthFacade } from '@neural/auth';

import { IGlobalData } from '@neural/shared/data';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class InsuranceEnquiriesEffects {
  constructor(
    private actions$: Actions<
      InsuranceEnquiriesActions.InsuranceEnquiriesActionsUnion
    >,
    private insuranceEnquiriesService: InsuranceEnquiriesService,
    private insuranceEnquiriesFacade: InsuranceEnquiriesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setInsuranceEnquiriesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.SetInsuranceEnquiriesPage.type),
      map(() => InsuranceEnquiriesActions.LoadInsuranceEnquiries())
    )
  );

  changeInsuranceEnquiriesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.ChangeInsuranceEnquiriesPage.type),
      map(() => InsuranceEnquiriesActions.LoadInsuranceEnquiries())
    )
  );

  setInsuranceEnquiriesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.SetInsuranceEnquiriesFilters.type),
      map(() => InsuranceEnquiriesActions.LoadInsuranceEnquiries())
    )
  );

  loadInsuranceEnquiries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.LoadInsuranceEnquiries.type),
      withLatestFrom(
        this.insuranceEnquiriesFacade.enquiriesConfig$,
        this.authFacade.selectedCorporate,
        this.insuranceEnquiriesFacade.getInsuranceEnquiriesFilters$,
        this.insuranceEnquiriesFacade.sorts$
      ),
      switchMap(([_, config, corporate, selectedFilters, sorts]) => {
        const corporateUuid = corporate.uuid;
        const filters = {
          ...selectedFilters,
        };
        return this.insuranceEnquiriesService
          .getInsuranceEnquiries({ corporateUuid, config, filters, sorts })
          .pipe(
            map((data: IGlobalData<IInsuranceEnquiries.IDocument>) =>
              InsuranceEnquiriesActions.LoadInsuranceEnquiriesSuccess({
                insuranceEnquiries: data.docs,
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
                InsuranceEnquiriesActions.LoadInsuranceEnquiriesFail({
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

  getEnquiry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.GetInsuranceEnquiry.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.insuranceEnquiriesService.getInsuranceEnquiry(payload).pipe(
          map((data: IInsuranceEnquiries.IDocument) =>
            InsuranceEnquiriesActions.GetInsuranceEnquirySuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InsuranceEnquiriesActions.GetInsuranceEnquiryFail({
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

  updateEnquiry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.UpdateInsuranceEnquiry.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.insuranceEnquiriesService
          .updateInsuranceEnquiry(payload)
          .pipe(
            map((data: IInsuranceEnquiries.IDocument) =>
              InsuranceEnquiriesActions.UpdateInsuranceEnquirySuccess({
                payload: {
                  id: data.uuid,
                  changes: data,
                },
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                InsuranceEnquiriesActions.UpdateInsuranceEnquiryFail({
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

  handleGetEnquiryFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.GetInsuranceEnquiryFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => InsuranceEnquiriesActions.RedirectToInsuranceEnquiries())
    )
  );

  handleRedirectToEnquiries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.RedirectToInsuranceEnquiries.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/support-center/enquiries/insurances'],
          },
        });
      })
    )
  );

  handleUpdateEnquirySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InsuranceEnquiriesActions.UpdateInsuranceEnquirySuccess.type),
      map((action) => {
        const { referenceNumber, numberPlate } = action.payload.changes;
        return this.toggleSnackbar(
          `${referenceNumber ?? numberPlate} has been updated.`
        );
      }),
      map(() => {
        return InsuranceEnquiriesActions.RedirectToInsuranceEnquiries();
      })
    )
  );

  handleUpdateEnquiryFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InsuranceEnquiriesActions.UpdateInsuranceEnquiryFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
