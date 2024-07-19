import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CampaignsFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

//Model
import { ICampaigns } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CampaignsResolver implements Resolve<boolean> {
  constructor(
    private campaignsFacade: CampaignsFacade,
    private authFacade: AuthFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.campaignsFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: ICampaigns.IConfig = {
            page: 1,
            limit: ICampaigns.Config.LIMIT,
          };
          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.campaignsFacade.changeCampaignsPage(params);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
