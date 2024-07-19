import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

//Ngrx
import { FleetFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class FleetExistsResolver implements Resolve<boolean> {
  constructor(private fleetFacade: FleetFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.fleetFacade.fleet$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.fleetFacade.getFleet(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
