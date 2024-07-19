import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { VehicleReferenceFacade } from '../+state';
import { IVehicleReference } from '../models';

@Injectable({
  providedIn: 'root',
})
export class VehicleReferencesResolver implements Resolve<boolean> {
  constructor(private vehicleReferenceFacade: VehicleReferenceFacade) {}

  resolve(): Observable<boolean> {
    return this.vehicleReferenceFacade.loaded$.pipe(
      tap((loaded$) => {
        if (!loaded$) {
          const params: IVehicleReference.IConfig = {
            page: 1,
            limit: IVehicleReference.Config.LIMIT,
          };
          this.vehicleReferenceFacade.setVehicleReferencesPage(params);
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
