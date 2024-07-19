import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ManualReservationFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ManualReservationsResolver implements Resolve<boolean> {
  constructor(private manualReservationFacade: ManualReservationFacade) {}

  resolve(): Observable<boolean> {
    return this.manualReservationFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.manualReservationFacade.loadAll();
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
