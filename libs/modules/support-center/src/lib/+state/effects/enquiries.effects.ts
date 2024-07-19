import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { EnquiriesActions } from '../actions';

// Services
import { EnquiriesService } from '../../services';

// Models
import { IEnquiries } from '../../models';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { EnquiriesFacade } from '../facades';

import { AuthFacade } from '@neural/auth';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class EnquiriesEffects {
  constructor(
    private actions$: Actions<EnquiriesActions.EnquiriesActionsUnion>,
    private enquiriesService: EnquiriesService,
    private enquiriesFacade: EnquiriesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setEnquiriesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnquiriesActions.SetEnquiriesPage.type),
      map(() => EnquiriesActions.LoadEnquiries())
    )
  );

  changeEnquiriesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnquiriesActions.ChangeEnquiriesPage.type),
      map(() => EnquiriesActions.LoadEnquiries())
    )
  );

  setEnquiriesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnquiriesActions.SetEnquiriesFilters.type),
      map(() => EnquiriesActions.LoadEnquiries())
    )
  );

  loadEnquiries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnquiriesActions.LoadEnquiries.type),
      withLatestFrom(
        this.enquiriesFacade.enquiriesConfig$,
        this.authFacade.selectedCorporate,
        this.enquiriesFacade.getEnquiriesFilters$,
        this.enquiriesFacade.sorts$
      ),
      switchMap(([_, params, corporate, selectedFilters, selectedSorts]) => {
        const filters = {
          corporateUuid: corporate.uuid,
          ...selectedFilters,
        };

        return this.enquiriesService.getEnquiries(params, filters, selectedSorts).pipe(
          map((data: IEnquiries.IData) =>
            EnquiriesActions.LoadEnquiriesSuccess({
              enquiries: data.docs,
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
              EnquiriesActions.LoadEnquiriesFail({
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
      ofType(EnquiriesActions.GetEnquiry.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.enquiriesService.getEnquiry(payload).pipe(
          map((data: IEnquiries.IDocument) =>
            EnquiriesActions.GetEnquirySuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              EnquiriesActions.GetEnquiryFail({
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
      ofType(EnquiriesActions.UpdateEnquiry.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.enquiriesService.updateEnquiry(payload).pipe(
          map((data: IEnquiries.IDocument) =>
            EnquiriesActions.UpdateEnquirySuccess({
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
              EnquiriesActions.UpdateEnquiryFail({
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

  handleGetEnquiryFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EnquiriesActions.GetEnquiryFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => EnquiriesActions.RedirectToEnquiries())
      )
  );

  handleRedirectToEnquiries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnquiriesActions.RedirectToEnquiries.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['app/support-center/enquiries/general'],
          },
        });
      })
    )
  );


  handleUpdateEnquirySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EnquiriesActions.UpdateEnquirySuccess.type),
        map((action) => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been updated.`);
        }),
        map(() => {
          return fromRoot.RouterActions.Go({
            payload: {
              path: ['/app/support-center/enquiries/general'],
            },
          });
        })
      ),
  );

  handleUpdateEnquiryFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EnquiriesActions.UpdateEnquiryFail.type),
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
