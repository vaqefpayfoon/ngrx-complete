import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { InboxTemplatesFacade } from '../../+state';

import * as fromAuth from '@neural/auth';

//Models
import { ITemplates } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class InboxTemplatesResolver implements Resolve<boolean> {
  constructor(
    private inboxTemplatesFacade: InboxTemplatesFacade,
    private authFacade: fromAuth.AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.inboxTemplatesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const config: ITemplates.IConfig = {
            page: 1,
            limit: ITemplates.Config.LIMIT,
          };

          const filters: ITemplates.IFilter[] = [
            {
              labels: [ITemplates.Labels.InboxMessage],
            },
          ];

          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.inboxTemplatesFacade.changeInboxTemplatesPage(
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
