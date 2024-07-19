import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable, of } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';
import { ServiceLineFacade } from '../+state';

@Injectable({
  providedIn: 'root'
})
export class CorporateResolver implements Resolve<boolean> {
  constructor(private serviceLineFacade: ServiceLineFacade) {}

  resolve(): Observable<any> {
    return this.serviceLineFacade.corporate$.pipe(
      tap((loaded) => {
        this.serviceLineFacade.getCorporate();
      }),
      filter(() => true),
      take(1)
    );
  }
}
