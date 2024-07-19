import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { DashboardBasicFacade } from '../+state/facades';

@Injectable({
  providedIn: 'root',
})
export class DashboardResolver implements Resolve<boolean> {
  constructor(private dashboardBasicFacade: DashboardBasicFacade) {}

  resolve(): Observable<boolean> {
    return this.dashboardBasicFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.dashboardBasicFacade.onLoad();
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
