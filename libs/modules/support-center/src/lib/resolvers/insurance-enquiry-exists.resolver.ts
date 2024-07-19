import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InsuranceEnquiriesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class InsuranceEnquiryExistsResolver implements Resolve<boolean> {
  constructor(private insuranceEnquiriesFacade: InsuranceEnquiriesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;
    return this.insuranceEnquiriesFacade.insuranceEnquiry$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.insuranceEnquiriesFacade.getEnquiry(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
