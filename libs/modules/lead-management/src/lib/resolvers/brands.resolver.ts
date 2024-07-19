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
export class BrandsResolver implements Resolve<boolean> {
  constructor(private leadFacade: LeadFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.leadFacade.unit$.pipe(
      tap((loaded) => {
        this.leadFacade.getBrandsAndSeries();
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
