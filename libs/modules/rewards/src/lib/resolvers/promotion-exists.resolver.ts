import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { PromotionsFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class PromotionExistsResolver implements Resolve<boolean> {
  constructor(private promotionsFacade: PromotionsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.promotionsFacade.promotion$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.promotionsFacade.getPromotion(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
