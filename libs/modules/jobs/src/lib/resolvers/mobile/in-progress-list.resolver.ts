import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take, map } from 'rxjs/operators';

//Ngrx
import { InProgressFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class InProgressListResolver implements Resolve<boolean> {
  constructor(private inProgressFacade: InProgressFacade) {}

  resolve(): Observable<boolean> {
    return this.inProgressFacade.loaded$.pipe(
      tap((loaded) => {
        this.inProgressFacade.onLoadList();
      }),
      filter(() => true),
      take(1)
    );
  }
}
