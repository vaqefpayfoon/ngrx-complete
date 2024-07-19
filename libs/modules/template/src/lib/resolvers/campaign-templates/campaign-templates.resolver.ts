import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CampaignTemplatesFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

//Model
import { ITemplates } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CampaignTemplatesResolver implements Resolve<boolean> {
  constructor(
    private campaignTemplatesFacade: CampaignTemplatesFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.campaignTemplatesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const config: ITemplates.IConfig = {
            page: 1,
            limit: ITemplates.Config.LIMIT,
          };

          const filters: ITemplates.IFilter[] = [
            {
              labels: [ITemplates.Labels.Campaign],
            },
          ];

          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.campaignTemplatesFacade.changeCampaignTemplatesPage(
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
