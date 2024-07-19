import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { AgreementsActions } from '../actions';

// Services
import { AgreementsService } from '../../services';

// Models
import { IAgreements } from '../../models';

// Facades
import { AgreementsFacade } from '../facades';

// Facades
import { AuthFacade } from '@neural/auth';

// RxJs
import { of } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  withLatestFrom
} from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class AgreementsEffects {
  constructor(
    private actions$: Actions<
      AgreementsActions.CorporateAgreementsActionsUnion
    >,
    private agreementsService: AgreementsService,
    private agreementsFacade: AgreementsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setCorporateAgreementsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgreementsActions.SetCorporateAgreementsPage.type),
      map(() => AgreementsActions.LoadCorporateAgreements())
    )
  );

  loadCorporateAgreements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgreementsActions.LoadCorporateAgreements.type),
      withLatestFrom(this.agreementsFacade.corporateAgreementsConfig$),
      switchMap(([_, params]) => {
        return this.agreementsService.listAgreements(params).pipe(
          map((data: IAgreements.IDocument[]) =>
            AgreementsActions.LoadCorporateAgreementsSuccess({
              payload: data
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              AgreementsActions.LoadCorporateAgreementsFail({
                payload: message
              })
            );
          })
        );
      })
    )
  );

  createCorporateAgreement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgreementsActions.CreateCorporateAgreement.type),
      map(action => action.payload),
      switchMap((payload) => {
        return this.agreementsService
          .createAgreement(payload)
          .pipe(
            map((agreement: IAgreements.IDocument) => {
              return AgreementsActions.CreateCorporateAgreementSuccess({
                payload: agreement
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                AgreementsActions.CreateCorporateAgreementFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleCreateCorporateAgreementSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgreementsActions.CreateCorporateAgreementSuccess.type),
      map(action => {
        const { type } = action.payload;
        this.toggleSnackbar(`${type} has been created`);
        return action.payload;
      }),
      map(corporateAgreement => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/${
                corporateAgreement.corporateUuid
              }/agreement`
            ]
          }
        });
      })
    )
  );

  handleCreateCorporateAgreementFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AgreementsActions.CreateCorporateAgreementFail.type),
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

  updateCorporateAgreement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgreementsActions.UpdateCorporateAgreement.type),
      map(action => action.payload),
      switchMap((payload) => {
        return this.agreementsService
          .updateAgreement(payload)
          .pipe(
            map((agreement: IAgreements.IDocument) => {
              return AgreementsActions.UpdateCorporateAgreementSuccess({
                payload: {
                  id: agreement.uuid,
                  changes: agreement
                }
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                AgreementsActions.UpdateCorporateAgreementFail({
                  payload: message
                })
              );
            })
          );
      })
    )
  );

  handleUpdateCorporateAgreementSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgreementsActions.UpdateCorporateAgreementSuccess.type),
      map(action => {
        const { type } = action.payload.changes;
        this.toggleSnackbar(`${type} has been updated`);
        return action.payload.changes;
      }),
      map(corporateAgreement => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [
              `/app/customer/corporates/${
                corporateAgreement.corporateUuid
              }/agreement`
            ]
          }
        });
      })
    )
  );

  handleUpdateCorporateAgreementFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AgreementsActions.UpdateCorporateAgreementFail.type),
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
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
