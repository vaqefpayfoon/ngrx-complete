import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { LeadFacade } from '../+state';

//Ngrx

@Injectable({
  providedIn: 'root',
})
export class LeadExistsResolver implements Resolve<boolean> {
  constructor(private leadFacade: LeadFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;
    return this.leadFacade.leadManagement$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.leadFacade.getLead(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
