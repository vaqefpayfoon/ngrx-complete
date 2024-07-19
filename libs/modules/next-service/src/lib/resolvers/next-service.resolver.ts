import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';


import { AuthFacade } from '@neural/auth';
import { NextServiceFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class NextServiceResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private nextServiceFacade: NextServiceFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.nextServiceFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.nextServiceFacade.resetNextServicePage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
