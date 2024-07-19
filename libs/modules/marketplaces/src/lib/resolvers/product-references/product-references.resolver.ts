import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ProductReferencesFacade } from '../../+state';

//Models
import { IProductReferences } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ProductReferencesResolver implements Resolve<boolean> {
  constructor(private productReferencesFacade: ProductReferencesFacade) {}

  resolve(): Observable<boolean> {
    return this.productReferencesFacade.loaded$.pipe(
      tap((loaded) => {
        const params: IProductReferences.IConfig = {
          page: 1,
          limit: IProductReferences.Config.LIMIT,
        };

        if (!loaded) {
          this.productReferencesFacade.setProductsPage(params);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
