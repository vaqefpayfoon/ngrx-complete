import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { EnquiriesFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class EnquiryExistsResolver implements Resolve<boolean> {
  constructor(private enquiriesFacade: EnquiriesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;
    return this.enquiriesFacade.enquiry$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.enquiriesFacade.getEnquiry(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
