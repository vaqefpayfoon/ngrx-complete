import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CompletedFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

//Model
import { IReservations } from '../../models';

//Moment
import * as _moment from 'moment';

import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Injectable({
  providedIn: 'root',
})
export class CompletedResolver implements Resolve<boolean> {
  constructor(
    private completedFacade: CompletedFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.completedFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              const params: IReservations.IFilter = {
                ['calendar.slot']: moment().format('YYYY-M-DD'),
                mobileService: 1,
                serviceType: 'MOBILE_SERVICE',
              };

              this.completedFacade.setMobileServiceScheduledFilter(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
