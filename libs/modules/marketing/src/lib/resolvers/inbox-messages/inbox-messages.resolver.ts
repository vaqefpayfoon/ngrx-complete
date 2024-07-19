import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

//Rxjs
import { Observable } from 'rxjs';
import { tap, filter, take } from 'rxjs/operators';

//Ngrx
import { CampaignsFacade, InboxMessagesFacade } from '../../+state';

import { AuthFacade } from '@neural/auth';

//Model
import { ICampaigns, IInboxMessages } from '../../models';

import { traverseAndRemove } from '@neural/shared/data';

@Injectable({
  providedIn: 'root',
})
export class InboxMessagesResolver implements Resolve<boolean> {
  constructor(
    private inboxMessagesFacade: InboxMessagesFacade,
    private authFacade: AuthFacade,
    private campaignsFacade:CampaignsFacade
  ) {}

  resolve(): Observable<boolean> {
    return this.inboxMessagesFacade.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          const params: IInboxMessages.IConfig = {
            page: 1,
            limit: IInboxMessages.Config.LIMIT,
          };

          const campaignParams:ICampaigns.IConfig={
            page:1,
            limit:10,
            active: true,
            _id:-1
          }

          this.authFacade.selectedCorporate.subscribe((x) => {
            if (!!x) {
              this.inboxMessagesFacade.changeInboxMessagesPage(params);

              this.campaignsFacade.changeCampaignsPage(campaignParams);
            }
          });
        }
      }),
      filter(() => true),
      take(1)
    );
  }
}
