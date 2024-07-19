import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Insurance Enquiries
import { IInsuranceEnquiries } from '../../models';

import {
  IGlobalPagination,
  IGlobalFilter,
  IGlobalConfig,
  IError,
} from '@neural/shared/data';

// Set Insurance Enquiries Page
export const SetInsuranceEnquiriesPage = createAction(
  '[Admin] Set Insurance Enquiries Page',
  props<{ payload: IGlobalConfig }>()
);

// Change Insurance Enquiries Page
export const ChangeInsuranceEnquiriesPage = createAction(
  '[Admin] Change Insurance Enquiries Page',
  props<{ payload: IGlobalConfig }>()
);

// Set InsuranceEnquiries Filters
export const SetInsuranceEnquiriesFilters = createAction(
  '[Admin] Set Insurance Enquiries Filters',
  props<{ payload: IGlobalFilter }>()
);

// Load Insurance Enquiries
export const LoadInsuranceEnquiries = createAction(
  '[Admin] Load Insurance Enquiries'
);
export const LoadInsuranceEnquiriesFail = createAction(
  '[Admin] Load Insurance Enquiries Fail',
  props<{ payload: IError }>()
);
export const LoadInsuranceEnquiriesSuccess = createAction(
  '[Admin] Load Insurance Enquiries Success',
  props<{
    insuranceEnquiries: IInsuranceEnquiries.IDocument[];
    pagination: IGlobalPagination;
  }>()
);

// Get Enquiry
export const GetInsuranceEnquiry = createAction(
  '[Admin] Get Insurance Enquiry',
  props<{ payload: string }>()
);
export const GetInsuranceEnquiryFail = createAction(
  '[Admin] Get Insurance Enquiry Fail',
  props<{ payload: IError }>()
);
export const GetInsuranceEnquirySuccess = createAction(
  '[Admin] Get Insurance Enquiry Success',
  props<{ payload: IInsuranceEnquiries.IDocument }>()
);

// Update Enquiry
export const UpdateInsuranceEnquiry = createAction(
  '[Admin] Update Insurance Enquiry',
  props<{ payload: IInsuranceEnquiries.IDocument }>()
);
export const UpdateInsuranceEnquiryFail = createAction(
  '[Admin] Update Insurance Enquiry Fail',
  props<{ payload: IError }>()
);
export const UpdateInsuranceEnquirySuccess = createAction(
  '[Admin] Update Insurance Enquiry Success',
  props<{ payload: Update<IInsuranceEnquiries.IDocument> }>()
);

// Reset Selected Enquiry
export const ResetSelectedInsuranceEnquiry = createAction(
  '[Admin] Reset Selected Insurance Enquiry'
);

// redirect
export const RedirectToInsuranceEnquiries = createAction(
  '[Configuration] Redirect To Insurance Enquiries'
);

const all = union({
  SetInsuranceEnquiriesPage,
  ChangeInsuranceEnquiriesPage,
  LoadInsuranceEnquiries,
  LoadInsuranceEnquiriesFail,
  LoadInsuranceEnquiriesSuccess,
  SetInsuranceEnquiriesFilters,
  GetInsuranceEnquiry,
  GetInsuranceEnquiryFail,
  GetInsuranceEnquirySuccess,
  UpdateInsuranceEnquiry,
  UpdateInsuranceEnquiryFail,
  UpdateInsuranceEnquirySuccess,
  ResetSelectedInsuranceEnquiry,
  RedirectToInsuranceEnquiries,
});
export type InsuranceEnquiriesActionsUnion = typeof all;
