import { createAction, props, union } from '@ngrx/store';

import { IBankLoan } from '../../models';

import { IRequest, IError } from '@neural/shared/data';
import { Update } from '@ngrx/entity';

// Load Bank Loan
export const CreateBankLoans = createAction(
  '[Hub] Create Bank Loan',
  props<IRequest<IBankLoan.CreateLoans>>()
);
export const CreateBankLoansFail = createAction(
  '[Hub] Create Bank Loan Fail',
  props<IRequest<IError>>()
);
export const CreateBankLoansSuccess = createAction(
  '[Hub] Create Bank Loan Success',
  props<IRequest<IBankLoan.IDocument[]>>()
);

// Load Bank Loan By Sale
export const LoadBankLoansBySale = createAction(
  '[Hub] Load Bank Loan By Sale Loan'
);
export const LoadBankLoansBySaleFail = createAction(
  '[Hub] Load Bank Loan By Sale Fail',
  props<IRequest<IError>>()
);
export const LoadBankLoansBySaleSuccess = createAction(
  '[Hub] Load Bank Loan By Sale Success',
  props<IRequest<IBankLoan.IDocument[]>>()
);

//Delete bank loan
export const DeleteBankLoan = createAction(
  '[Hub] Delete Bank Loan',
  props<IRequest<string>>()
);
export const DeleteBankLoanFail = createAction(
  '[Hub] Delete Bank Loan Fail',
  props<IRequest<IError>>()
);
export const DeleteBankLoanSuccess = createAction(
  '[Hub] Delete Bank Loan Success',
  props<IRequest<string>>()
);

//Update bank loan
export const UpdateBankLoan = createAction(
  '[Hub] Update Bank Loan',
  props<IRequest<IBankLoan.IUpdateBankLoan>>()
);
export const UpdateBankLoanFail = createAction(
  '[Hub] Update Bank Loan Fail',
  props<IRequest<IError>>()
);
export const UpdateBankLoanSuccess = createAction(
  '[Hub] Update Bank Loan Success',
  props<IRequest<Update<IBankLoan.IDocument>>>()
);

const all = union({
  CreateBankLoans,
  CreateBankLoansFail,
  CreateBankLoansSuccess,
  LoadBankLoansBySale,
  LoadBankLoansBySaleFail,
  LoadBankLoansBySaleSuccess,
  DeleteBankLoan,
  DeleteBankLoanFail,
  DeleteBankLoanSuccess,
  UpdateBankLoan,
  UpdateBankLoanFail,
  UpdateBankLoanSuccess,
});
export type BankLoansActionsUnion = typeof all;
