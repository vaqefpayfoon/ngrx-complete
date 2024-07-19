import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { PromotionsFacade } from '../+state';

import * as fromAuth from '@neural/auth';

//Model
import { IPromotions } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PromotionsResolver implements Resolve<boolean> {
  constructor(
    private promotionsFacade: PromotionsFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.promotionsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IPromotions.IConfig = {
            page: 1,
            limit: IPromotions.Config.LIMIT,
          };

          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.promotionsFacade.setPromotionsPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
