import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { AccountsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class AccountExistsResolver implements Resolve<boolean> {
  constructor(private accountsFacade: AccountsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.accountsFacade.account$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.accountsFacade.getAccount(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
