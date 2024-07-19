import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ServiceLineFacade } from '../+state';

import * as fromAuth from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class ServiceLineResolver implements Resolve<boolean> {
  constructor(
    private serviceLineFacade: ServiceLineFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.serviceLineFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.serviceLineFacade.resetServiceLinePage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
