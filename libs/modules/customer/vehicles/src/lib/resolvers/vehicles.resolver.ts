import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { VehiclesFacade } from '../+state';
import * as fromAuth from '@neural/auth';

//Models
import { IVehicle } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VehiclesResolver implements Resolve<boolean> {
  constructor(
    private vehiclesFacade: VehiclesFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.vehiclesFacade.loaded$.pipe(
      tap((loaded$) => {
        if (!loaded$) {
          const params: IVehicle.IConfig = {
            page: 1,
            limit: IVehicle.Config.LIMIT,
          };
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (x) {
              this.vehiclesFacade.setVehiclesPage(params);
              this.vehiclesFacade.loadVehiclesBrand();
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
