import { ISalesAdvisor } from '@neural/modules/administration';
import { IModels } from '@neural/modules/models';
import { IError } from '@neural/shared/data';
import { Update } from '@ngrx/entity';
import { createAction, props, union } from '@ngrx/store';
import { ILead, ILeadNotes, ILeadTestDrive, IWishList, leadPurchaseQuotes } from '../../models';

export const loadLeadManagements = createAction(
  '[Hub list] Get leadManagements'
);

export const loadLeadManagementsSuccess = createAction(
  '[Hub list] Get leadManagements success',
  props<{ leads: ILead.IDocument[]; pagination: ILead.IPagination }>()
);

export const loadLeadManagementsFailed = createAction(
  '[Hub list] Get LeadManagements failed',
  props<{ payload: IError }>()
);

export const SetLeadManagementsPage = createAction(
  '[Hub] Set LeadManagements Page',
  props<{ payload: ILead.IConfig }>()
);

export const ChangeLeadManagementsPage = createAction(
  '[Hub] Change LeadManagements Page',
  props<{ payload: ILead.IConfig }>()
);

export const SetLeadManagementsFilters = createAction(
  '[Hub] Set LeadManagements Filters',
  props<{ payload: ILead.IFilter }>()
);

export const GetLeadManagement = createAction(
  '[Hub] Get LeadManagement',
  props<{ payload: string }>()
);
export const GetLeadManagementFail = createAction(
  '[Hub] Get LeadManagement Fail',
  props<{ payload: IError }>()
);
export const GetLeadManagementSuccess = createAction(
  '[Hub] Get LeadManagement Success',
  props<{ payload: ILead.IDocument }>()
);

export const CreateLeadManagement = createAction(
  '[Hub] Create Lead Management',
  props<{ payload: ILead.ICreate }>()
);
export const CreateLeadManagementFail = createAction(
  '[Hub] Create Lead Management Fail',
  props<{ payload: any }>()
);
export const CreateLeadManagementSuccess = createAction(
  '[Hub] Create Lead Management Success',
  props<{ payload: ILead.IDocument }>()
);

export const UpdateLeadManagement = createAction(
  '[Hub] Update Lead Management',
  props<{
    payload: { changes: ILead.IUpdate; lead: ILead.IDocument };
  }>()
);
export const UpdateLeadManagementFail = createAction(
  '[Hub] Update Lead Management Fail',
  props<{ payload: any }>()
);
export const UpdateLeadManagementSuccess = createAction(
  '[Hub] Update Lead Management Success',
  props<{ payload: Update<ILead.IUpdate> }>()
);
export const ResetSelectedLeadManagement = createAction(
  '[Hub] Reset Selected LeadManagement'
);
export const ResetSalesAdvisor = createAction(
  '[Hub] Reset SalesAdvisor'
);
export const RedirectToLeadManagement = createAction(
  '[Hub] Redirect To LeadManagement'
);

export const GetSalesAdvisor = createAction(
  '[Hub] Get Sales Advisor For LeadManagement',
  props<{ payload: ILead.SA}>()
);
export const GetSalesAdvisorFail = createAction(
  '[Hub] Get Sales Advisor For LeadManagement Fail',
  props<{ payload: IError }>()
);
export const GetSalesAdvisorSuccess = createAction(
  '[Hub] Get Sales Advisor For LeadManagement Success',
  props<{ payload: ISalesAdvisor.ISADocument[] }>()
);

export const GetWishList = createAction(
  '[Hub] Get WishList',
  props<{ payload: string }>()
);
export const GetWishListFail = createAction(
  '[Hub] Get WishList Fail',
  props<{ payload: IError }>()
);
export const GetWishListSuccess = createAction(
  '[Hub] Get WishList Success',
  props<{ payload: IWishList.IData }>()
);
export const GetPurchaseQuote = createAction(
  '[Hub] Get PurchaseQuote',
  props<{ payload: string }>()
);
export const GetPurchaseQuoteFail = createAction(
  '[Hub] Get PurchaseQuote Fail',
  props<{ payload: IError }>()
);
export const GetPurchaseQuoteSuccess = createAction(
  '[Hub] Get PurchaseQuote Success',
  props<{ payload: leadPurchaseQuotes.IData }>()
);
export const GetTestDrive = createAction(
  '[Hub] Get TestDrive',
  props<{ payload: string }>()
);
export const GetTestDriveFail = createAction(
  '[Hub] Get TestDrive Fail',
  props<{ payload: IError }>()
);
export const GetTestDriveSuccess = createAction(
  '[Hub] Get TestDrive Success',
  props<{ payload: ILeadTestDrive.IData }>()
);
export const GetGlobalBrands = createAction('[Admin] Get Global Brands');
export const GetGlobalBrandsFail = createAction(
  '[Admin] Get Global Brands Fail',
  props<{ payload: any }>()
);
export const GetGlobalBrandsSuccess = createAction(
  '[Admin] Get Global Brands Success',
  props<{ payload: string[] }>()
);

export const CreateLeadNote = createAction(
  '[Hub] Create Lead Note',
  props<{ payload: ILeadNotes.ISaveNote }>()
);
export const CreateLeadNoteFail = createAction(
  '[Hub] Create Lead Note Fail',
  props<{ payload: any }>()
);
export const CreateLeadNoteSuccess = createAction(
  '[Hub] Create Lead Note Success',
  props<{ payload: ILead.IDocument }>()
);

export const UpdateLeadNote = createAction(
  '[Hub] Update Lead Note',
  props<{
    payload: { changes: ILeadNotes.ISaveNote, noteUuid: string};
  }>()
);
export const UpdateLeadNoteFail = createAction(
  '[Hub] Update Lead Note Fail',
  props<{ payload: any }>()
);
export const UpdateLeadNoteSuccess = createAction(
  '[Hub] Update Lead Note Success',
  props<{ payload: Update<ILead.IDocument> }>()
);

export const DeleteLeadNote = createAction(
  '[Admin] Delete Lead Note',
  props<{ payload: {uuid: string, noteUuid: string} }>()
);
export const DeleteLeadNoteFail = createAction(
  '[Admin] Delete Lead Note Fail',
  props<{ payload: any }>()
);
export const DeleteLeadNoteSuccess = createAction(
  '[Admin] Delete Lead Note Success',
  props<{ payload: ILead.IDocument }>()
);

export const SendManualInvitation = createAction(
  '[Hub] Send ManualInvitation',
  props<{ payload: string }>()
);
export const SendManualInvitationFail = createAction(
  '[Hub] Send ManualInvitation Fail',
  props<{ payload: string }>()
);
export const SendManualInvitationSuccess = createAction(
  '[Hub] Send ManualInvitation Success'
);

const all = union({
  loadLeadManagements,
  loadLeadManagementsSuccess,
  loadLeadManagementsFailed,
  SetLeadManagementsPage,
  ChangeLeadManagementsPage,
  SetLeadManagementsFilters,
  GetLeadManagement,
  GetLeadManagementSuccess,
  GetLeadManagementFail,
  CreateLeadManagement,
  CreateLeadManagementSuccess,
  CreateLeadManagementFail,
  UpdateLeadManagement,
  UpdateLeadManagementSuccess,
  UpdateLeadManagementFail,
  ResetSelectedLeadManagement,
  RedirectToLeadManagement,
  GetSalesAdvisor,
  GetSalesAdvisorSuccess,
  GetSalesAdvisorFail,
  GetWishList,
  GetWishListFail,
  GetWishListSuccess,
  GetPurchaseQuote,
  GetPurchaseQuoteFail,
  GetPurchaseQuoteSuccess,
  CreateLeadNote,
  CreateLeadNoteSuccess,
  CreateLeadNoteFail,
  UpdateLeadNote,
  UpdateLeadNoteSuccess,
  UpdateLeadNoteFail,
  DeleteLeadNote,
  DeleteLeadNoteSuccess,
  DeleteLeadNoteFail,
  GetTestDrive,
  GetTestDriveSuccess,
  GetTestDriveFail,
  SendManualInvitation,
  SendManualInvitationFail,
  SendManualInvitationSuccess
});
export type LeadManagementsActionsUnion = typeof all;
