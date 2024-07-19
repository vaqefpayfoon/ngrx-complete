import { EnquiriesGuard } from './enquiries.guard';
import { EnquiryExistsGuard } from './enquiry-exists.guard';
import { InsuranceEnquiriesGuard } from './insurance-enquiries.guard';
import { InsuranceEnquiryExistsGuard } from './insurance-enquiry-exists.guard';

export const guards: any[] = [
  EnquiriesGuard,
  EnquiryExistsGuard,
  InsuranceEnquiriesGuard,
  InsuranceEnquiryExistsGuard,
];

export * from './enquiries.guard';
export * from './enquiry-exists.guard';
export * from './insurance-enquiries.guard';
export * from './insurance-enquiry-exists.guard';
