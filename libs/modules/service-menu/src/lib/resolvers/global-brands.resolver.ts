import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { ServiceLineFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class GlobalBrandsResolver implements Resolve<boolean> {
  constructor(private serviceLineFacade: ServiceLineFacade) {}

  resolve(): Observable<any> {
    return this.serviceLineFacade.globalBrands$.pipe(
      tap((loaded) => {
        this.serviceLineFacade.getBrands();
      }),
      filter(() => true),
      take(1)
    );
  }
}
