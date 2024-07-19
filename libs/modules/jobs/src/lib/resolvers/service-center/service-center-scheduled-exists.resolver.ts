import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ServiceCenterScheduledFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ServiceCenterScheduledExistsResolver implements Resolve<boolean> {
  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.serviceCenterScheduledFacade.completedReservation$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.serviceCenterScheduledFacade.getServiceCenterScheduled(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
