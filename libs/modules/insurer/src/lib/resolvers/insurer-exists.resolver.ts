import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

//Ngrx
import { InsurerFacade } from '../+state';
import { IInsurer } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InsurerExistsResolver implements Resolve<boolean> {
  constructor(private purchasesFacade: InsurerFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const uuid = route.params.uuid;

    return this.hasInsurer(uuid).pipe(
      switchMap((loaded) => {
        return of(loaded);
      })
    );
  }

  hasInsurer(uuid: string): Observable<boolean> {
    return this.purchasesFacade.entities$.pipe(
      switchMap((entities: { [key: string]: IInsurer.IDocument | undefined }) =>
        of(!!entities[uuid])
      ),
      take(1)
    );
  }
}
