import { createAction, props, union } from '@ngrx/store';

import { Update } from '@ngrx/entity';

// Enquiries
import { IEnquiries } from '../../models';
import { IError } from '@neural/shared/data';

// Set Enquiries Page
export const SetEnquiriesPage = createAction(
  '[Admin] Set Enquiries Page',
  props<{ payload: IEnquiries.IConfig }>()
);

// Change Enquiries Page
export const ChangeEnquiriesPage = createAction(
  '[Admin] Change Enquiries Page',
  props<{ payload: IEnquiries.IConfig }>()
);

// Set Enquiries Filters
export const SetEnquiriesFilters = createAction(
  '[Admin] Set Enquiries Filters',
  props<{ payload: IEnquiries.IFilter }>()
);

// Load Enquiries
export const LoadEnquiries = createAction('[Admin] Load Enquiries');
export const LoadEnquiriesFail = createAction(
  '[Admin] Load Enquiries Fail',
  props<{ payload: IError }>()
);
export const LoadEnquiriesSuccess = createAction(
  '[Admin] Load Enquiries Success',
  props<{
    enquiries: IEnquiries.IDocument[];
    pagination: IEnquiries.IPagination;
  }>()
);

// Get Enquiry
export const GetEnquiry = createAction(
  '[Admin] Get Enquiry',
  props<{ payload: string }>()
);
export const GetEnquiryFail = createAction(
  '[Admin] Get Enquiry Fail',
  props<{ payload: IError }>()
);
export const GetEnquirySuccess = createAction(
  '[Admin] Get Enquiry Success',
  props<{ payload: IEnquiries.IDocument }>()
);

// Update Enquiry
export const UpdateEnquiry = createAction(
  '[Admin] Update Enquiry',
  props<{ payload: IEnquiries.IDocument }>()
);
export const UpdateEnquiryFail = createAction(
  '[Admin] Update Enquiry Fail',
  props<{ payload: IError }>()
);
export const UpdateEnquirySuccess = createAction(
  '[Admin] Update Enquiry Success',
  props<{ payload: Update<IEnquiries.IDocument> }>()
);

// Reset Selected Enquiry
export const ResetSelectedEnquiry = createAction(
  '[Admin] Reset Selected Enquiry'
);

// redirect
export const RedirectToEnquiries = createAction(
  '[Configuration] Redirect To Enquiries'
);

const all = union({
  SetEnquiriesPage,
  ChangeEnquiriesPage,
  LoadEnquiries,
  LoadEnquiriesFail,
  LoadEnquiriesSuccess,
  GetEnquiry,
  GetEnquiryFail,
  GetEnquirySuccess,
  UpdateEnquiry,
  UpdateEnquiryFail,
  UpdateEnquirySuccess,
  SetEnquiriesFilters,
  ResetSelectedEnquiry,
  RedirectToEnquiries,
});
export type EnquiriesActionsUnion = typeof all;
