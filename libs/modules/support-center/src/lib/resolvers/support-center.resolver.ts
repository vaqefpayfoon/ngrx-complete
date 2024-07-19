import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { EnquiriesFacade } from '../+state';

import * as fromAuth from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class SupportCenterResolver implements Resolve<boolean> {
  constructor(
    private enquiriesFacade: EnquiriesFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.enquiriesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.enquiriesFacade.resetEnquiriesPage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
