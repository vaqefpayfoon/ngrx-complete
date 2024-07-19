import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

//Ngrx
import { GroupsFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class GroupExistsResolver implements Resolve<boolean> {
  constructor(private groupsFacade: GroupsFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.groupsFacade.group$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.groupsFacade.getGroup(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
