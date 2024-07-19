import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CarModelsFacade } from '../+state';

@Injectable({
  providedIn: 'root',
})
export class BrandSeriesExistsResolver implements Resolve<boolean> {
  constructor(private carModelsFacade: CarModelsFacade) {}

  resolve(): Observable<boolean> {
    return this.carModelsFacade.modelsModify$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.carModelsFacade.getBrandsAndSeries();
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
