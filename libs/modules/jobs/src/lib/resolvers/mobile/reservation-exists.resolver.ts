import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ReservationsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ReservationExistsResolver implements Resolve<boolean> {
  constructor(private reservationsFacade: ReservationsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.reservationsFacade.reservation$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.reservationsFacade.getReservation(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
