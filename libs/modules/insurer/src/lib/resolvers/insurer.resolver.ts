import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InsurerFacade } from '../+state/facades';
import { IGlobalConfig, GlobalPaginationConfig } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class InsurerResolver implements Resolve<boolean> {
  constructor(private insurerFacade: InsurerFacade) {}

  resolve(): Observable<boolean> {
    return this.insurerFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const config: IGlobalConfig = {
            limit: GlobalPaginationConfig.LIMIT,
            page: 1,
          };

          this.insurerFacade.setPage(config);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
