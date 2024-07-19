import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISalesState } from '../reducers';

// Action
import { BankLoansActions } from '../actions';

// Selectors
import { bankLoansQuery } from '../selectors';
import { IBankLoan } from '../../models';

import { CountryService } from '@neural/modules/administration';
import { Observable } from 'rxjs';

@Injectable()
export class BankLoansBySaleFacade {
  loaded$ = this.store.select(bankLoansQuery.getBankLoansLoaded);

  loans$ = this.store.select(bankLoansQuery.getAllBankLoans);
  
  error$ = this.store.select(bankLoansQuery.getBankLoansError);

  constructor(
    private store: Store<ISalesState>,
    private countryService: CountryService
  ) {}

  loadBankLoansBySale(): void {
    this.store.dispatch(BankLoansActions.LoadBankLoansBySale());
  }

  createBankLoans(payload: IBankLoan.CreateLoans): void {
    this.store.dispatch(BankLoansActions.CreateBankLoans({ payload }));
  }

  onDeleteBankLoan(payload: string): void {
    this.store.dispatch(BankLoansActions.DeleteBankLoan({ payload }));
  }

  onUpdateBankLoan(payload: IBankLoan.IUpdateBankLoan): void {
    this.store.dispatch(BankLoansActions.UpdateBankLoan({ payload }));
  }

  loadCountryNames(): Observable<string[]> {
    return this.countryService.getCountryNames();
  }
}
