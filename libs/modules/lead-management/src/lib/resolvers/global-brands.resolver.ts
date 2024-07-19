import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { LeadFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class GlobalBrandsResolver implements Resolve<boolean> {
  constructor(private leadFacade: LeadFacade) {}

  resolve(): Observable<any> {
    return this.leadFacade.globalBrands$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.leadFacade.getBrands();
        }
        return of(true);
      }),
      filter(() => true),
      take(1)
    );
  }
}
