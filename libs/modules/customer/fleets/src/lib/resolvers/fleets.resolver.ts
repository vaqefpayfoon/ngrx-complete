import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

//Ngrx
import { FleetFacade } from '../+state';
import { AuthFacade } from '@neural/auth';

//Models
import { IFleet } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FleetsResolver implements Resolve<boolean> {
  constructor(
    private fleetFacade: FleetFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.fleetFacade.loaded$.pipe(
      tap((loaded) => {
        const params: IFleet.IConfig = {
          page: 1,
          limit: IFleet.Config.LIMIT,
        };

        if (!loaded) {
          this.authFacade.selectedBranch.subscribe((x) => {
            if (x) {
              this.fleetFacade.setFleetPage(x.uuid, params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
