import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BusinessesFacade } from '../+state';

//Model
import { IBusinesses } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BusinessesResolver implements Resolve<boolean> {
  constructor(private businessesFacade: BusinessesFacade) {}

  resolve(): Observable<boolean> {
    return this.businessesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IBusinesses.IConfig = {
            page: 1,
            limit: IBusinesses.Config.LIMIT,
          };
          this.businessesFacade.changeBusinessesPage(params);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
