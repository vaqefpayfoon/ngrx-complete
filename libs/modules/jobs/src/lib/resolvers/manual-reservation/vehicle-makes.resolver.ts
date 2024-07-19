import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { ManualReservationFacade } from '../../+state';

//Ngrx

@Injectable({
  providedIn: 'root',
})
export class VehicleMakesResolver implements Resolve<boolean> {
  constructor(private manualReservationFacade: ManualReservationFacade) {}

  resolve(): Observable<any> {
    return this.manualReservationFacade.vehicleMakes$.pipe(
      tap((loaded) => {
        this.manualReservationFacade.getVehicleMakes();
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
