import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { PurchasesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class PurchaseExistsResolver implements Resolve<boolean> {
  constructor(private purchasesFacade: PurchasesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.purchasesFacade.purchase$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.purchasesFacade.getPurchase(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
