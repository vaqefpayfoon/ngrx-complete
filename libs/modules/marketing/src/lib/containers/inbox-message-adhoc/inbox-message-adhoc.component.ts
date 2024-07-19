import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IInboxMessages, ICampaignTargets, IInbox } from '../../models';

// facade
import {
  InboxMessagesFacade,
  CampaignTargetsFacade,
} from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { IAccount } from '@neural/modules/administration';
import { IVehicle } from '@neural/modules/customer/vehicles';

@Component({
  selector: 'neural-inbox-message-adhoc',
  templateUrl: './inbox-message-adhoc.component.html',
  styleUrls: ['./inbox-message-adhoc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxMessageAdhocComponent implements OnInit {
  title = 'send inbox message';

  error$: Observable<any>;

  inboxMessage$: Observable<IInboxMessages.IDocument>;

  accounts$: Observable<Auth.IAccount[]>;
  vehicles$: Observable<IVehicle.IDocument[]>;
  campaignTargets$: Observable<ICampaignTargets.IDocument[]>;

  permissions$: Observable<{}>;
  
  codes$: Observable<Auth.IPhoneCode[]>;

  bc: IBC[];

  constructor(
    private inboxMessagesFacade: InboxMessagesFacade,
    private campaignTargetsFacade: CampaignTargetsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
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
        name: 'send',
        path: null,
      },
    ];

    this.error$ = this.inboxMessagesFacade.error$;

    this.inboxMessage$ = this.inboxMessagesFacade.inboxMessage$;

    this.campaignTargets$ = this.campaignTargetsFacade.campaignTargets$;

    this.accounts$ = this.inboxMessagesFacade.accounts$;

    this.vehicles$ = this.inboxMessagesFacade.vehicles$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Inbox.SEND_INBOX_MESSAGE,
    ]);

    this.codes$ = this.authFacade.codes$; 
  }

  ngOnInit() {
    this.initialData();
  }

  onCreate(inboxMessage: IInbox.ISendMessage) {
    if (!!inboxMessage) {
      this.inboxMessagesFacade.onSend(inboxMessage);
    }
  }

  onLoad(inboxMessage: IInboxMessages.IDocument) {
    if (!!inboxMessage) {
      this.title = inboxMessage.payload.title;

      this.bc[this.bc.length - 1].name = inboxMessage.payload.title;
    }
  }

  onSetCampaignTargetsPage(filters: ICampaignTargets.IFilter[]) {
    const config: ICampaignTargets.IConfig = {
      limit: ICampaignTargets.Config.LIMIT,
      page: 1,
    };
    this.campaignTargetsFacade.setCampaignTargetsPage(config, filters);
  }

  onSearch(filters: IInboxMessages.IFilter) {
    if (filters) {
      this.inboxMessagesFacade.onFilter(filters);
    }
  }

  onSearchVehicle(filters: IInboxMessages.IFilter) {
    if (filters) {
      this.inboxMessagesFacade.onVehicleFilter(filters);
    }
  }

}
