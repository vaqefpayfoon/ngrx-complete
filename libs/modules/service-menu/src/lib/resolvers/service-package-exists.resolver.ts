import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ServicePackageFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class ServicePackageExistsResolver implements Resolve<boolean> {
  constructor(private servicePackageFacade: ServicePackageFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.servicePackageFacade.servicePackage$.pipe(
      tap((loaded) => {
        this.servicePackageFacade.getServicePackage(uuid);
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
