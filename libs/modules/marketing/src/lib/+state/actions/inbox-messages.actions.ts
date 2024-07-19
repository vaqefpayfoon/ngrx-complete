import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Models
import { IInboxMessages, IInbox } from '../../models';
import { IError } from '@neural/shared/data';
import { Auth } from '@neural/auth';
import { IAccount } from '@neural/modules/administration';
import { IVehicle } from '@neural/modules/customer/vehicles';

// Set Inbox Messages Page
export const SetInboxMessagesPage = createAction(
  '[Admin] Set Inbox Messages Page',
  props<{ payload: IInboxMessages.IConfig }>()
);

// Load Inbox Messages
export const LoadInboxMessages = createAction('[Admin] Load Inbox Messages');
export const LoadInboxMessagesFail = createAction(
  '[Admin] Load Inbox Messages Fail',
  props<{ payload: IError }>()
);
export const LoadInboxMessagesSuccess = createAction(
  '[Admin] Load Inbox Messages Success',
  props<{
    inboxMessages: IInboxMessages.IDocument[];
    pagination: IInboxMessages.IPagination;
  }>()
);

// Create Inbox Messages
export const CreateInboxMessage = createAction(
  '[Admin] Create Inbox Message',
  props<{ payload: IInboxMessages.ICreate }>()
);
export const CreateInboxMessageFail = createAction(
  '[Admin] Create Inbox Message Fail',
  props<{ payload: any }>()
);
export const CreateInboxMessageSuccess = createAction(
  '[Admin] Create Inbox Message Success',
  props<{ payload: IInboxMessages.IDocument }>()
);

// Send Inbox Messages
export const SendInboxMessage = createAction(
  '[Admin] Send Inbox Message',
  props<{ payload: IInbox.ISendMessage }>()
);
export const SendInboxMessageFail = createAction(
  '[Admin] Send Inbox Message Fail',
  props<{ payload: IError }>()
);
export const SendInboxMessageSuccess = createAction(
  '[Admin] Send Inbox Message Success'
);

// Get Accounts
export const GetInboxAccounts = createAction(
  '[Admin] Get Inbox Accounts',
  props<{ payload: IInboxMessages.IFilter }>()
);
export const GetInboxAccountsFail = createAction(
  '[Admin] Get Inbox Accounts Fail',
  props<{ payload: IError }>()
);
export const GetInboxAccountsSuccess = createAction(
  '[Admin] Get Inbox Accounts Success',
  props<{ payload: Auth.IAccount[] }>()
);


// Set Inbox messages Filters
export const SetInboxMessagesFilters = createAction(
  '[Hub] Set Inbox Messages Filters',
  props<{ payload: IInboxMessages.IFilter }>()
);

// redirect
export const RedirectToInboxMessages = createAction(
  '[Admin] Redirect To Inbox Messages'
);

export const LoadVehicles = createAction(
  '[Admin] Load Vehicles',
  props<{ payload: IVehicle.IFilter }>()
);
export const LoadVehiclesFail = createAction(
  '[Admin] Load Vehicles Fail',
  props<{ payload: any }>()
);
export const LoadVehiclesSuccess = createAction(
  '[Admin] Load Vehicles Success',
  props<{ payload: IVehicle.IDocument[] }>()
);

export const ResetFilters = createAction(
  '[Admin] Reset Filters'
);

const all = union({
  SetInboxMessagesPage,
  LoadInboxMessages,
  LoadInboxMessagesFail,
  LoadInboxMessagesSuccess,
  CreateInboxMessage,
  CreateInboxMessageFail,
  CreateInboxMessageSuccess,
  SendInboxMessage,
  SendInboxMessageFail,
  SendInboxMessageSuccess,
  GetInboxAccounts,
  GetInboxAccountsFail,
  GetInboxAccountsSuccess,
  RedirectToInboxMessages,
  SetInboxMessagesFilters,
  LoadVehicles,
  LoadVehiclesSuccess,
  LoadVehiclesFail,
  ResetFilters
});
export type InboxMessagesActionsUnion = typeof all;
