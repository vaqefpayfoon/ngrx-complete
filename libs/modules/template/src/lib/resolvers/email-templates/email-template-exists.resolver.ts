import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { EmailTemplatesFacade } from '../../+state';

import * as fromAuth from '@neural/auth';

//Model
import { ITemplates } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateExistsResolver implements Resolve<boolean> {
  constructor(
    private emailTemplatesFacade: EmailTemplatesFacade,
    private authfacade: fromAuth.AuthFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const uuid = route.params.uuid;

    return this.emailTemplatesFacade.template$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.emailTemplatesFacade.getEmailTemplate(uuid);
        }
      }),
      filter((loaded) => !!loaded),
      take(1)
    );
  }
}
