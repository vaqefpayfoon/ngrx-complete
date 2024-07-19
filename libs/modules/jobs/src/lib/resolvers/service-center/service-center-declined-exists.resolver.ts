import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ServiceCenterDeclinedFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ServiceCenterDeclinedExistsResolver implements Resolve<boolean> {
  constructor(
    private serviceCenterDeclinedFacade: ServiceCenterDeclinedFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.serviceCenterDeclinedFacade.reservation$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.serviceCenterDeclinedFacade.getServiceCenterDeclined(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
