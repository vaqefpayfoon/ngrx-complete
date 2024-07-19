import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CarModelsFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class ModelExistsResolver implements Resolve<boolean> {
  constructor(private carModelsFacade: CarModelsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;
    return this.carModelsFacade.model$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.carModelsFacade.getModel(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
