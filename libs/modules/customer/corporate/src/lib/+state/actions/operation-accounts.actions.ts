import { IAccount } from '@neural/modules/administration';
import { createAction, props, union } from '@ngrx/store';
import { IBranches } from '../../models';




export const LoadOperationAccounts = createAction(
  '[Admin] Load Operation Accounts',
  props<{ payload: IBranches.IOperationPayload }>()
);
export const LoadOperationAccountsFail = createAction(
  '[Admin] Load Operation Accounts Fail',
  props<{ payload: any }>()
);
export const LoadOperationAccountsSuccess = createAction(
  '[Admin] Load Operation Accounts Success',
  props<{ accounts: IAccount.IDocument[]; pagination: IAccount.IPagination }>()
);

const all = union({
  LoadOperationAccounts,
  LoadOperationAccountsFail,
  LoadOperationAccountsSuccess,
});
export type OperationAccountsActionsUnion = typeof all;
