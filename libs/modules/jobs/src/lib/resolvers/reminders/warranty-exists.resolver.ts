import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { WarrantiesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class WarrantyExistsResolver implements Resolve<boolean> {
  constructor(private warrantiesFacade: WarrantiesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.warrantiesFacade.warranty$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.warrantiesFacade.getWarranty(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
