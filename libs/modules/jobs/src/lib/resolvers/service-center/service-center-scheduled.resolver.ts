import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import {
  ManualReservationFacade,
  ReservationsFacade,
  ServiceCenterScheduledFacade,
  ServiceLineFacade,
} from '../../+state';

import { AuthFacade } from '@neural/auth';

//Models
import { IReservations } from '../../models';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;
@Injectable({
  providedIn: 'root',
})
export class ServiceCenterScheduledResolver implements Resolve<boolean> {
  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private authFacade: AuthFacade,
    private reservationsFacade: ReservationsFacade,
    private manualReservationFacade: ManualReservationFacade,
    private serviceLineFacade:ServiceLineFacade,
  ) {}

  resolve(): Observable<boolean> {
    return this.serviceCenterScheduledFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IReservations.IFilter = {
            ['calendar.slot']: moment().format('YYYY-M-DD'),
            mobileService: 0,
            serviceType: 'SERVICE_CENTER',
          };
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (x) {
              this.reservationsFacade.getCorporate(x.uuid);
              this.manualReservationFacade.loadAlloperations();
              // this.serviceLineFacade.getServiceLineList()
            }
          });

          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              this.serviceCenterScheduledFacade.setServiceCenterScheduledFilter(
                params
              );
              this.serviceLineFacade.getBranch(x.uuid);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
