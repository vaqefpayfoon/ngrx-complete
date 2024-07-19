import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CountriesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class CountriesResolver implements Resolve<boolean> {
  constructor(private countriesFacade: CountriesFacade) {}

  resolve(): Observable<boolean> {
    return this.countriesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.countriesFacade.onLoad();
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
