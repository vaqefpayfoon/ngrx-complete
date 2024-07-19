import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BankLoansBySaleFacade, PurchasesFacade } from '../+state/facades';

@Injectable({
  providedIn: 'root',
})
export class BankLoansBySaleResolver implements Resolve<boolean> {
  constructor(
    private purchasesFacade: PurchasesFacade,
    private bankLoansBySaleFacade: BankLoansBySaleFacade
  ) {}

  resolve(): Observable<any> {
    return this.purchasesFacade.purchase$.pipe(
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
