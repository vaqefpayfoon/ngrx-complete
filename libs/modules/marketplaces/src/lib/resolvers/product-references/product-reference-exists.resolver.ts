import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ProductReferencesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class ProductReferenceExistsResolver implements Resolve<boolean> {
  constructor(private productReferencesFacade: ProductReferencesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.productReferencesFacade.productReference$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.productReferencesFacade.getProductReference(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
