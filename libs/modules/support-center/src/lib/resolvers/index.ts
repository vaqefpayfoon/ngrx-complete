import { SupportCenterResolver } from './support-center.resolver';
import { EnquiryExistsResolver } from './enquiry-exists.resolver';
import { InsuranceEnquiriesResolver } from './insurance-enquiries.resolver';
import { InsuranceEnquiryExistsResolver } from './insurance-enquiry-exists.resolver';

export const resolvers: any[] = [
  SupportCenterResolver,
  EnquiryExistsResolver,
  InsuranceEnquiriesResolver,
  InsuranceEnquiryExistsResolver,
];

export * from './support-center.resolver';
export * from './enquiry-exists.resolver';
export * from './insurance-enquiries.resolver';
export * from './insurance-enquiry-exists.resolver';
