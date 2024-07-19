import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InsuranceEnquiriesFacade } from '../+state';

import * as fromAuth from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class InsuranceEnquiriesResolver implements Resolve<boolean> {
  constructor(
    private insuranceEnquiriesFacade: InsuranceEnquiriesFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.insuranceEnquiriesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.insuranceEnquiriesFacade.resetInsuranceEnquiriesPage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
