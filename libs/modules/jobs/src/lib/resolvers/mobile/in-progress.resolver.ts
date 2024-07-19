import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

//Ngrx
import { InProgressFacade, ReservationsFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class InProgressResolver implements Resolve<boolean> {
  constructor(
    private inProgressFacade: InProgressFacade,
    private authFacade: AuthFacade,
    private reservationsFacade: ReservationsFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.inProgressFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.inProgressFacade.onLoad();
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (x) {
              this.reservationsFacade.getCorporate(x.uuid);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
