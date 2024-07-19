import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BankLoansBySaleFacade, PurchaseQuotesFacade } from '../+state/facades';

@Injectable({
  providedIn: 'root',
})
export class BankLoansByQuotesResolver implements Resolve<boolean> {
  constructor(
    private purchaseQuotesFacade: PurchaseQuotesFacade,
    private bankLoansBySaleFacade: BankLoansBySaleFacade
  ) {}

  resolve(): Observable<any> {
    return this.purchaseQuotesFacade.purchase$.pipe(
      tap((loaded) => {
        if (loaded) {
          this.bankLoansBySaleFacade.loadBankLoansBySale();
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
