import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { ICampaigns, IInboxMessages } from '../../models';

// facade
import { CampaignsFacade, InboxMessagesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-inbox-message-item',
  templateUrl: './inbox-message-item.component.html',
  styleUrls: ['./inbox-message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxMessageItemComponent implements OnInit {
  title = 'create a new inbox message';

  selectedCorporate$: Observable<Auth.ICorporates>;

  campaigns$: Observable<ICampaigns.IDocument[]>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  constructor(
    private inboxMessagesFacade: InboxMessagesFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private campaignsFacade:CampaignsFacade
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'marketing',
        path: null,
      },
      {
        name: 'inbox messages',
        path: '/app/marketing/inbox-messages',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.error$ = this.inboxMessagesFacade.error$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.campaigns$ = this.campaignsFacade.campaigns$;

    this.loading$ = this.campaignsFacade.loading$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Inbox.CREATE_INBOX_MESSAGE,
      permissionTags.Inbox.LIST_INBOX_MESSAGE,
    ]);
  }

  ngOnInit() {
    this.initialData();
  }

  onCreate(campaign: IInboxMessages.ICreate) {
    if (!!campaign) {
      this.inboxMessagesFacade.onCreate(campaign);
    }
  }

  onSearch(params:ICampaigns.IConfig){
    this.campaignsFacade.changeCampaignsPage(params);
  }


  onCorporateChange(event: boolean) {
    if (event) {
      this.inboxMessagesFacade.onRedirect();
    }
  }
}
