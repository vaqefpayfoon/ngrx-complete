import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BrandsFacade } from '../../+state';

@Injectable({
  providedIn: 'root'
})
export class GlobalBrandsResolver implements Resolve<boolean> {
  constructor(private brandsFacade: BrandsFacade) {}

  resolve(): Observable<any> {
    return this.brandsFacade.globalBrands$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.brandsFacade.getBrands();
        }
        return of(true);
      }),
      filter(() => true),
      take(1)
    );
  }
}
