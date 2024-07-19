import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InboxTemplatesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class InboxTemplateExistsResolver implements Resolve<boolean> {
  constructor(private inboxTemplatesFacade: InboxTemplatesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.inboxTemplatesFacade.template$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.inboxTemplatesFacade.getInboxTemplate(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
