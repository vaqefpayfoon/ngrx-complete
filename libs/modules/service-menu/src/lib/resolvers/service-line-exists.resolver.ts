import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ServiceLineFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class ServiceLineExistsResolver implements Resolve<boolean> {
  constructor(private serviceLineFacade: ServiceLineFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.serviceLineFacade.serviceLine$.pipe(
      tap((loaded) => {
        this.serviceLineFacade.getServiceLine(uuid);
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
