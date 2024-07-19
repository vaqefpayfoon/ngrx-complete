import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ProductCoveragesFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

//Services
import { ServicesFacade } from '@neural/modules/customer/services';

//Model
import { IProductCoverages } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ProductCoveragesResolver implements Resolve<boolean> {
  constructor(
    private productCoveragesFacade: ProductCoveragesFacade,
    private authFacade: AuthFacade,
    private servicesFacade: ServicesFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.productCoveragesFacade.loaded$.pipe(
      tap((loaded) => {
        const params: IProductCoverages.IConfig = {
          page: 1,
          limit: IProductCoverages.Config.LIMIT,
        };

        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              this.productCoveragesFacade.setProductsPage(params);
              this.servicesFacade.onLoad();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
