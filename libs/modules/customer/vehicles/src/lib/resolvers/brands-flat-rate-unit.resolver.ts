import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { BrandsFlatRateUnitFacade } from '../+state';

import * as fromAuth from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class BrandsFlatRateUnitResolver implements Resolve<boolean> {
  constructor(
    private brandsFlatRateUnitFacade: BrandsFlatRateUnitFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.brandsFlatRateUnitFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              this.brandsFlatRateUnitFacade.onLoad();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
