import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrxs
import { ServicesFacade } from '../+state';

import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class ServicesResolver implements Resolve<boolean> {
  constructor(
    private servicesFacade: ServicesFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.servicesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              this.servicesFacade.onLoad();
              this.servicesFacade.selectBranch();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
