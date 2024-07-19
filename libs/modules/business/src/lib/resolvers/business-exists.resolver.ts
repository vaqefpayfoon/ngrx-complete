import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BusinessesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class BusinessExistsResolver implements Resolve<boolean> {
  constructor(private businessesFacade: BusinessesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.businessesFacade.business$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.businessesFacade.getBusiness(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
