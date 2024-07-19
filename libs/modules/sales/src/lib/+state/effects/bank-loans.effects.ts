import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { BankLoansActions } from '../actions';

// Services
import { BankLoansService } from '../../services';

// Models
import { IBankLoan } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { PurchasesFacade, PurchaseQuotesFacade } from '../facades';

@Injectable()
export class BankLoansEffects {
  constructor(
    private actions$: Actions<BankLoansActions.BankLoansActionsUnion>,
    private bankLoansService: BankLoansService,
    private purchasesFacade: PurchasesFacade,
    private purchaseQuotesFacade: PurchaseQuotesFacade,
    private snackBar: MatSnackBar
  ) {}

  createBankLoans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BankLoansActions.CreateBankLoans.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.bankLoansService.createBankLoans({ payload }).pipe(
          map((data: IBankLoan.IDocument[]) =>
            BankLoansActions.CreateBankLoansSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BankLoansActions.CreateBankLoansFail({
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

  loadBankLoansBySale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BankLoansActions.LoadBankLoansBySale.type),
      withLatestFrom(
        this.purchasesFacade.purchase$,
        this.purchaseQuotesFacade.purchase$
      ),
      switchMap(([_, selectedPurchase, selectedPurchaseQuote]) => {
        const uuid = selectedPurchase
          ? selectedPurchase.uuid
          : selectedPurchaseQuote.uuid;

        return this.bankLoansService
          .getBankLoansBySale({ payload: uuid })
          .pipe(
            map((data: IBankLoan.IDocument[]) =>
              BankLoansActions.LoadBankLoansBySaleSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                BankLoansActions.LoadBankLoansBySaleFail({
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

  handleCreateBankLoansSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BankLoansActions.CreateBankLoansSuccess.type),
        map(() => this.toggleSnackbar(`bank loans have been created.`))
      ),
    { dispatch: false }
  );

  handleCreateBankLoansFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BankLoansActions.CreateBankLoansFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  deleteBankLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BankLoansActions.DeleteBankLoan.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.bankLoansService.deleteBankLoan(payload).pipe(
          map(() =>
            BankLoansActions.DeleteBankLoanSuccess({
              payload,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BankLoansActions.DeleteBankLoanFail({
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

  handleDeleteBankLoanSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BankLoansActions.DeleteBankLoanSuccess.type),
        map(() => this.toggleSnackbar(`bank loan has been deleted.`))
      ),
    { dispatch: false }
  );

  handleDeleteBankLoanFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BankLoansActions.DeleteBankLoanFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );

  updateBankLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BankLoansActions.UpdateBankLoan.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.bankLoansService.updateBankLoan({ payload }).pipe(
          map((data) =>
            BankLoansActions.UpdateBankLoanSuccess({
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
              BankLoansActions.UpdateBankLoanFail({
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

  handleUpdateBankLoanSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BankLoansActions.UpdateBankLoanSuccess.type),
        map(() => this.toggleSnackbar(`bank loan has been updated.`))
      ),
    { dispatch: false }
  );

  handleUpdateBankLoanFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BankLoansActions.UpdateBankLoanFail.type),
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
