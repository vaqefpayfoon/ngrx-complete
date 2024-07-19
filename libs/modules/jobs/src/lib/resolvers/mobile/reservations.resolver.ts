import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ReservationsFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

//Models
import { IReservations } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ReservationsResolver implements Resolve<boolean> {
  constructor(
    private reservationsFacade: ReservationsFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.reservationsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              const E = IReservations.Status;
              const keys = Object.keys(E).filter(
                (k) =>
                  typeof E[k as any] === 'string' &&
                  (E[k as any] === 'BOOKING_ON_HOLD' ||
                    E[k as any] === 'JOB_CANCELED' ||
                    E[k as any] === 'NOT_OPERATIONAL')
              );
              const statusFilter = keys.map((k) => E[k as any]);

              const slot = new Date();

              const dateFilter = (
                slot.getFullYear() +
                '-' +
                (slot.getMonth() + 1) +
                '-' +
                slot.getDate()
              ).toString();

              const params: IReservations.IConfig = {
                statusFilter,
                dateFilter,
                mobileService: 1,
                page: 1,
                limit: IReservations.Config.LIMIT,
              };
              this.reservationsFacade.setResevationPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
