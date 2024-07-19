import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { VehicleReferenceFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class VehicleReferencesExistResolver implements Resolve<boolean> {
  constructor(private vehicleReferenceFacade: VehicleReferenceFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.vehicleReferenceFacade.vehicleReference$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.vehicleReferenceFacade.getVehicleReference(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
