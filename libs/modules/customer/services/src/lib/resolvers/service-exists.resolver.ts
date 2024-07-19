import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrxs
import { ServicesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class ServiceExistsResolver implements Resolve<boolean> {
  constructor(private servicesFacade: ServicesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.servicesFacade.service$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.servicesFacade.getService(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
