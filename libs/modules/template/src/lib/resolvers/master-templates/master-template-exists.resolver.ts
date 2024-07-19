import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { MasterTemplatesFacade } from '../../+state';

@Injectable({
  providedIn: 'root',
})
export class MasterTemplateExistsResolver implements Resolve<boolean> {
  constructor(private masterTemplatesFacade: MasterTemplatesFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.masterTemplatesFacade.template$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.masterTemplatesFacade.getMasterTemplate(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
