import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { LeadFacade } from '../+state/facades';

import { AuthFacade } from '@neural/auth';

@Injectable({
  providedIn: 'root',
})
export class LeadManagementResolver implements Resolve<boolean> {
  constructor(
    private authFacade: AuthFacade,
    private leadFacade: LeadFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.leadFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (!!x) {
              this.leadFacade.resetLeadManagementPage();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
