import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InboxMessagesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class InboxMessageExistsResolver implements Resolve<boolean> {
  constructor(private inboxMessagesFacade: InboxMessagesFacade) {}

  resolve(): Observable<any> {
    return this.inboxMessagesFacade.inboxMessage$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.inboxMessagesFacade.onRedirect();
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
