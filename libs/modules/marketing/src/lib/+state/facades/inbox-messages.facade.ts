import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICampaignsState } from '../reducers';
import { modelStore } from '@neural/modules/models';

// Selector
import { inboxMessagesQuery } from '../selectors';

// Action
import { InboxMessagesActions } from '../actions';

// Model
import { IInboxMessages, IInbox } from '../../models';

@Injectable()
export class InboxMessagesFacade {
  loading$ = this.store.select(inboxMessagesQuery.getInboxMessagesLoading);

  loaded$ = this.store.select(inboxMessagesQuery.getInboxMessagesLoaded);

  error$ = this.store.select(inboxMessagesQuery.getInboxMessagesError);

  inboxMessages$ = this.store.select(inboxMessagesQuery.getAllInboxMessages);

  inboxMessage$ = this.store.select(inboxMessagesQuery.getSelectedInbox);

  getInboxMessagesFilters$ = this.store.select(inboxMessagesQuery.getInboxMessagesFilters);


  inboxMessagesConfig$ = this.store.select(
    inboxMessagesQuery.getInboxMessagesPage
  );

  accounts$ = this.store.select(inboxMessagesQuery.getSearchedAccount);

  vehicles$ = this.store.select(inboxMessagesQuery.getSearchedVehicle);

  total$ = this.store.select(inboxMessagesQuery.getInboxMessagesTotal);

  constructor(private store: Store<ICampaignsState>) {}

  changeInboxMessagesPage(config: IInboxMessages.IConfig) {
    this.store.dispatch(
      InboxMessagesActions.SetInboxMessagesPage({ payload: config })
    );
  }

  onCreate(inboxMessages: IInboxMessages.ICreate) {
    this.store.dispatch(
      InboxMessagesActions.CreateInboxMessage({ payload: inboxMessages })
    );
  }

  onSend(inboxMessages: IInbox.ISendMessage) {
    this.store.dispatch(
      InboxMessagesActions.SendInboxMessage({ payload: inboxMessages })
    );
  }

  onFilter(payload: IInboxMessages.IFilter) {
    this.store.dispatch(InboxMessagesActions.GetInboxAccounts({ payload }));
  }

  onResetFilter() {
    this.store.dispatch(InboxMessagesActions.ResetFilters());
  }

  onVehicleFilter(payload: IInboxMessages.IFilter) {
    this.store.dispatch(InboxMessagesActions.LoadVehicles({ payload }));
  }


  changeInboxMessagesFilter(filter: IInboxMessages.IFilter) {
    this.store.dispatch(
      InboxMessagesActions.SetInboxMessagesFilters({ payload: filter })
    );
  }

  onRedirect() {
    this.store.dispatch(InboxMessagesActions.RedirectToInboxMessages());
  }
}
