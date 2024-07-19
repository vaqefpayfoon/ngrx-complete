import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { PurchaseQuotesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class PurchaseQuoteExistsResolver implements Resolve<boolean> {
  constructor(private purchaseQuotesFacade: PurchaseQuotesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.purchaseQuotesFacade.purchase$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.purchaseQuotesFacade.getPurchase(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
