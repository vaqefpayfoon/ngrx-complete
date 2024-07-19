import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { BusinessesActions } from '../actions';

// Services
import { BusinessesService } from '../../services';

// Models
import { IBusinesses } from '../../models';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  tap,
  debounceTime,
  withLatestFrom
} from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { BusinessesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class BusinessesEffects {
  constructor(
    private actions$: Actions<BusinessesActions.BusinessesActionsUnion>,
    private accountsActions$: Actions<BusinessesActions.AccountsActionsUnion>,
    private businessesService: BusinessesService,
    private businessesFacade: BusinessesFacade,
    private snackBar: MatSnackBar
  ) {}

  setBusinessesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.SetBusinessesPage.type),
      map(() => BusinessesActions.LoadBusinesses())
    )
  );

  loadBusinesses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.LoadBusinesses.type),
      withLatestFrom(this.businessesFacade.businessesConfig$),
      switchMap(([_, params]) => {
        return this.businessesService.getBusinesses(params).pipe(
          map((data: IBusinesses.IData) =>
            BusinessesActions.LoadBusinessesSuccess({
              payload: {
                businesses: data.docs,
                pagination: {
                  limit: data.limit,
                  page: data.page,
                  pages: data.pages,
                  total: data.total
                }
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.LoadBusinessesFail({ payload: message })
            );
          })
        );
      })
    )
  );

  getBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.GetBusiness.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.businessesService.getBusiness(payload).pipe(
          map((data: IBusinesses.IDocument) =>
            BusinessesActions.GetBusinessSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.GetBusinessFail({
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

  activateBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.ActivateBusiness.type),
      map(action => action.payload),
      switchMap((business: IBusinesses.IDocument) => {
        return this.businessesService.activateBusiness(business).pipe(
          map(() =>
            BusinessesActions.ActivateBusinessSuccess({
              payload: {
                id: business.uuid,
                changes: {
                  name: business.name,
                  active: !business.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.ActivateBusinessFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleGetBusinessFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.GetBusinessFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => BusinessesActions.RedirectToBusinesses())
      )
  );

  handleRedirectToBusinesses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.RedirectToBusinesses.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/businesses'],
          },
        });
      })
    )
  );

  handleActivateBusinessSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.ActivateBusinessSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleActivateBusinessFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.ActivateBusinessFail.type),
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

  deactivateBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.DeactivateBusiness.type),
      map(action => action.payload),
      switchMap((business: IBusinesses.IDocument) => {
        return this.businessesService.deactivateBusinesses(business).pipe(
          map(() =>
            BusinessesActions.DeactivateBusinessSuccess({
              payload: {
                id: business.uuid,
                changes: {
                  name: business.name,
                  active: !business.active
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.DeactivateBusinessFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleDeactivateBusinessFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.DeactivateBusinessFail.type),
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

  handleDeactivateBusinessSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.DeactivateBusinessSuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  createBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.CreateBusiness.type),
      map(action => action.payload),
      switchMap((payload: IBusinesses.IDocument) => {
        return this.businessesService.createBusiness(payload).pipe(
          map((business: IBusinesses.IDocument) => {
            return BusinessesActions.CreateBusinessSuccess({
              payload: business
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.CreateBusinessFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleCreateBusinessSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.CreateBusinessSuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/businesses']
          }
        });
      })
    )
  );

  handleCreateBusinessFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.CreateBusinessFail.type),
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

  updateBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.UpdateBusiness.type),
      map(action => action.payload),
      switchMap((payload: IBusinesses.IDocument) => {
        return this.businessesService.updateBusiness(payload).pipe(
          map((business: IBusinesses.IDocument) => {
            return BusinessesActions.UpdateBusinessSuccess({
              payload: {
                id: business.uuid,
                changes: business
              }
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.UpdateBusinessFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleUpdateBusinessSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.UpdateBusinessSuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated.`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/businesses']
          }
        });
      })
    )
  );

  handleUpdateBusinessFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.UpdateBusinessFail.type),
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

  assosiateBusinessAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.AssosiateBusinessAccounts.type),
      map(action => action.payload),
      switchMap((payload: IBusinesses.IAssociate) => {
        return this.businessesService.assosiateAccounts(payload).pipe(
          map((res: any) => {
            return BusinessesActions.AssosiateBusinessAccountsSuccess({
              payload: res
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.AssosiateBusinessAccountsFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  handleAssosiateBusinessAccountsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BusinessesActions.AssosiateBusinessAccountsFail.type),
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

  handleAssosiateBusinessAccountsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BusinessesActions.AssosiateBusinessAccountsSuccess.type),
      map(() => {
        return this.toggleSnackbar(`business accounts has been associated.`);
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/customer/businesses']
          }
        });
      })
    )
  );

  changeAccountsPage$ = createEffect(() =>
    this.accountsActions$.pipe(
      ofType(BusinessesActions.ChangeAccountsPage.type),
      map(action => action.payload),
      withLatestFrom(this.businessesFacade.search$),
      switchMap(([payload, params]) => {
        return this.businessesService.getAccounts(params, payload).pipe(
          map(data =>
            BusinessesActions.SearchAccountSuccess({
              payload: {
                accounts: data.docs,
                pagination: {
                  limit: data.limit,
                  page: data.page,
                  pages: data.pages,
                  total: data.total
                }
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.SearchAccountFail({ payload: message })
            );
          })
        );
      })
    )
  );

  searchAccount$ = createEffect(() =>
    this.accountsActions$.pipe(
      ofType(BusinessesActions.SearchAccount.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.businessesService.getAccounts(payload).pipe(
          map(data =>
            BusinessesActions.SearchAccountSuccess({
              payload: {
                accounts: data.docs,
                pagination: {
                  limit: data.limit,
                  page: data.page,
                  pages: data.pages,
                  total: data.total
                }
              }
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BusinessesActions.SearchAccountFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleSearchAccountFail$ = createEffect(
    () =>
      this.accountsActions$.pipe(
        ofType(BusinessesActions.SearchAccountFail.type),
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

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
