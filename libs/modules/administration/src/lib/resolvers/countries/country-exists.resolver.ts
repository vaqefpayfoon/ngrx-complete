import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

//Ngrx
import { CountriesFacade } from '../../+state';

//Models
import { ICountry } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CountryExistsResolver implements Resolve<boolean> {
  constructor(private countriesFacade: CountriesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const uuid = route.params.uuid;

    return this.hasCountry(uuid).pipe(
      switchMap((loaded) => {
        return of(loaded);
      })
    );
  }

  hasCountry(uuid: string): Observable<boolean> {
    return this.countriesFacade.countriesEntities$.pipe(
      map((entities: { [key: string]: ICountry.IDocument }) => {
        if (entities[uuid]) {
          return !!entities[uuid];
        }
      }),
      take(1)
    );
  }
}
