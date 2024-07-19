import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { PurchaseQuotesFacade } from '../+state/facades';

import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class PurchaseQuotesResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private purchaseQuotesFacade: PurchaseQuotesFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.purchaseQuotesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.purchaseQuotesFacade.resetPurchaseQuotesPage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
