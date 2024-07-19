import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ManualReservationFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ManualReservationExistsResolver implements Resolve<boolean> {
  constructor(private manualReservationFacade: ManualReservationFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.manualReservationFacade.manualReservation$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.manualReservationFacade.getManualReservation(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
