import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CompletedFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class CompletedExistsResolver implements Resolve<boolean> {
  constructor(private completedFacade: CompletedFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.completedFacade.completedReservation$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.completedFacade.getCompletedReservation(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
