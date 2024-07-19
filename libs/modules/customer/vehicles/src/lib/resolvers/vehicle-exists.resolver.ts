import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { VehiclesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class VehicleExistsResolver implements Resolve<boolean> {
  constructor(private vehiclesFacade: VehiclesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.vehiclesFacade.vehicle$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.vehiclesFacade.getVehicle(uuid);
        } else {
          this.vehiclesFacade.loadVehiclesBrand();
          this.vehiclesFacade.loadVehiclesInspections(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
