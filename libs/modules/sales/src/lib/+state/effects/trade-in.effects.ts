import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import {
  PurchasesActions,
  TradeInActions,
  PurchaseQuotesActions,
} from '../actions';

// Services
import { TradeInService } from '../../services';

// Models
import { ITradeIn } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { PurchasesFacade, PurchaseQuotesFacade } from '../facades';

@Injectable()
export class TradeInEffects {
  constructor(
    private actions$: Actions<TradeInActions.TradeInActionsUnion>,
    private tradeInService: TradeInService,
    private purchasesFacade: PurchasesFacade,
    private purchaseQuotesFacade: PurchaseQuotesFacade,
    private snackBar: MatSnackBar
  ) {}

  createTradeIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.CreateTradeIn.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.tradeInService.createTradeIn(payload).pipe(
          map((data: ITradeIn.ITradeInDocumnet) =>
            TradeInActions.CreateTradeInSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TradeInActions.CreateTradeInFail({
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

  updateTradeIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TradeInActions.UpdateTradeIn.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.tradeInService.updateTradeIn(payload).pipe(
          map((data: ITradeIn.ITradeInDocumnet) =>
            TradeInActions.UpdateTradeInSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              TradeInActions.UpdateTradeInFail({
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

  handleCreateAndUpdateTradeInSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TradeInActions.UpdateTradeInSuccess.type,
        TradeInActions.CreateTradeInSuccess.type
      ),
      map((action) => action.payload),
      withLatestFrom(
        this.purchasesFacade.purchase$,
        this.purchaseQuotesFacade.purchase$
      ),
      map(([tradeIn, purchase, purchaseQuote]) => {
        if (purchase) {
          return PurchasesActions.UpdatePurchaseSuccess({
            payload: {
              id: tradeIn.saleUuid,
              changes: {
                ...purchase,
                tradeIn: tradeIn,
              },
            },
          });
        } else {
          return PurchaseQuotesActions.UpdatePurchaseQuoteSuccess({
            payload: {
              id: tradeIn.saleUuid,
              changes: {
                ...purchaseQuote,
                tradeIn: tradeIn,
              },
            },
          });
        }
      })
    )
  );

  handleUpdateTradeInFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TradeInActions.UpdateTradeInFail.type,
          TradeInActions.CreateTradeInFail.type
        ),
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
