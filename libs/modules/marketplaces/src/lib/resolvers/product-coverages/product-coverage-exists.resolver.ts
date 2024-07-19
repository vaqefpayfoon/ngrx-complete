import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ProductCoveragesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ProductCoverageExistsResolver implements Resolve<boolean> {
  constructor(private productCoveragesFacade: ProductCoveragesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.productCoveragesFacade.productCoverage$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.productCoveragesFacade.getProductCoverage(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
