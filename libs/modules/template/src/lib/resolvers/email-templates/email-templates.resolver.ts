import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

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
export class EmailTemplatesResolver implements Resolve<boolean> {
  constructor(
    private emailTemplatesFacade: EmailTemplatesFacade,
    private authfacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.emailTemplatesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const config: ITemplates.IConfig = {
            page: 1,
            limit: ITemplates.Config.LIMIT,
          };

          const filters: ITemplates.IFilter[] = [
            {
              labels: [ITemplates.Labels.EmailNotification],
            },
          ];

          this.authfacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.emailTemplatesFacade.changeEmailTemplatesPage(
                config,
                filters
              );
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
