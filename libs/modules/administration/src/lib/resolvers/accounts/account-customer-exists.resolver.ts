import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

// Rxjs
import { Observable } from 'rxjs';
import { filter, tap, take } from 'rxjs/operators';

// NgRx
import { CustomerAccountsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class AccountCustomerExistsResolver implements Resolve<boolean> {
  constructor(private customerAccountsFacade: CustomerAccountsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.customerAccountsFacade.account$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.customerAccountsFacade.getCustomerAccount(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
