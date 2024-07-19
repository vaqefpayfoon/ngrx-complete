import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Nxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CurrenciesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class CurrenciesResolver implements Resolve<boolean> {
  constructor(private currenciesFacade: CurrenciesFacade) {}

  resolve(): Observable<boolean> {
    return this.currenciesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.currenciesFacade.LoadCurrencies();
        }
      }),
      filter((loaded) => loaded),
      take(1)
    );
  }
}
