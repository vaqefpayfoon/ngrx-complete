import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { ServicePackageFacade } from '../+state';

import * as fromAuth from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class ServicePackageResolver implements Resolve<boolean> {
  constructor(
    private servicePackageFacade: ServicePackageFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.servicePackageFacade.loaded$.pipe(
      tap((loaded) => {
        this.authFacade.selectedBranch.subscribe((x) => {
          if (!!x) {
            this.servicePackageFacade.resetServicePackagePage();
          }
        });
      }),
      filter(() => true),
      take(1)
    );
  }
}
