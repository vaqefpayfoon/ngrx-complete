import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { ServicePackageFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class PackageBrandsResolver implements Resolve<boolean> {
  constructor(private servicePackageFacade: ServicePackageFacade) {}

  resolve(): Observable<any> {
    return this.servicePackageFacade.globalBrands$.pipe(
      tap((loaded) => {
        this.servicePackageFacade.getBrands();
      }),
      filter(() => true),
      take(1)
    );
  }
}
