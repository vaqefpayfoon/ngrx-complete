import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IInboxMessages } from '../../models';

// facade
import { InboxMessagesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'neural-inbox-messages',
  templateUrl: './inbox-messages.component.html',
  styleUrls: ['./inbox-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxMessagesComponent implements OnInit {
  title = 'inbox messages';

  bc: IBC[];

  inboxMessages$: Observable<IInboxMessages.IDocument[]>;

  inboxMessagesConfig$: Observable<IInboxMessages.IConfig>;

  InboxMessagesFilters$: Observable<IInboxMessages.IFilter>;

  total$: Observable<number>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private inboxMessagesFacade: InboxMessagesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

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
        path: null,
      },
    ];

    this.inboxMessagesFacade.onResetFilter();

    this.inboxMessages$ = this.inboxMessagesFacade.inboxMessages$;

    this.inboxMessagesConfig$ = this.inboxMessagesFacade.inboxMessagesConfig$;

    this.InboxMessagesFilters$ = this.inboxMessagesFacade.getInboxMessagesFilters$;

    this.total$ = this.inboxMessagesFacade.total$;

    this.loading$ = this.inboxMessagesFacade.loading$;

    this.error$ = this.inboxMessagesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Inbox.LIST_INBOX_MESSAGE,
      permissionTags.Inbox.CREATE_INBOX_MESSAGE,
      permissionTags.Inbox.GET_INBOX_MESSAGE,
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IInboxMessages.IConfig = {
        limit: IInboxMessages.Config.LIMIT,
        page: 1,
      };

      this.inboxMessagesFacade.changeInboxMessagesPage(params);
    }
  }

  changePage(event: PageEvent) {
    const params: IInboxMessages.IConfig = {
      limit: IInboxMessages.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.inboxMessagesFacade.changeInboxMessagesPage(params);
  }

  onSearch(event: IInboxMessages.IFilter) {
    if (event) {
      this.inboxMessagesFacade.changeInboxMessagesFilter(event);
    }
  }
}
