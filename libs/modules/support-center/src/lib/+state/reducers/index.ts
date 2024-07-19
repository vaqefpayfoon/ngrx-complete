import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromEnquiries from './enquiries.reducer';
import * as fromInsuranceEnquiries from './insurance-enquiries.reducer';

export interface ISupportCenter {
  readonly enquiries: fromEnquiries.EnquiriesState;
  readonly insuranceEnquiries: fromInsuranceEnquiries.InsuranceEnquiriesState;
}

export const REDUCERS: ActionReducerMap<ISupportCenter> = {
  enquiries: fromEnquiries.reducer,
  insuranceEnquiries: fromInsuranceEnquiries.reducer,
};

export const getSupportCenterState = createFeatureSelector<ISupportCenter>(
  'supportCenter'
);
