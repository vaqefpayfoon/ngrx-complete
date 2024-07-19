export enum BranchNotification {
  CUSTOMER = 'CUSTOMER',
  SALES_ADVISOR = 'SALES ADVISOR / SERVICE ADVISOR',
}

export const EventTitle = {
  'test-drive': {
    'test-drive-request-without-sales-advisor':
      'Test Drive Request without any Sales Advisor',
    'test-drive-request-with-sales-advisor':
      'Test Drive Request with Sales Advisor',
    'test-drive-request-sales-advisor-assigned':
      'Test Drive Request Sales Advisor Assigned',
  },
  sales: {
    'purchase-request-without-sales-advisor':
      'Purchase Request without any Sales Advisor',
    'purchase-request-with-sales-advisor':
      'Purchase Request with Sales Advisor',
    'purchase-request-sales-advisor-assigned':
      'Purchase Request Sales Advisor Assigned',
    'document-signed': 'Document Signed',
    'rco-signed': 'RCO Signed',
    'downpayment-paid': 'Downpayment Paid',
    'calendar-appointment': 'Calendar Appointment',
    'purchase-quote-non-registered-account-invitation':
      'Purchase Quote Non Registered Account Invitation',
    'sale-confirmation-receipt': 'Sale Confirmation Receipt',
  },
  'bank-loan': {
    'loan-decision': 'Loan Decision',
  },
  'trade-in': {
    'trade-in-valuation-decision': 'Trade-In Valuation Decision',
    'trade-in-inspection-request': 'Trade-In Inspection Request',
    'trade-in-inspection-valuation-decision':
      'Trade-In Inspection Valuation Decision',
  },
  'insurance-enquiry': {
    'insurance-enquiry-received': 'Insurance Enquiry Received',
  },
  'service-packages': {
    'manual-digital-repair-order-generated':
      'Manual Digital Repair Order Generated',
    'manual-digital-invoice-generated': 'Manual Digital Invoice Generated',
  },
  'manual-reservation': {
    'manual-customer-arrived': 'Manual Customer Arrived',
    'manual-pre-service-inspection-completed':
      'Manual Pre-Service Inspection Completed',
    'manual-service-started': 'Manual Service Started',
    'manual-service-completed': 'Manual Service Completed',
    'manual-post-service-inspection-completed':
      'Manual Post-Service Inspection Completed',
    'manual-reschedule': 'Manual Reschedule',
    'manual-next-service-booking': 'Manual Next Service Booking',
    'manual-next-service-completed': 'Manual Next Service Completed',
    'manual-service-advisor-reassigned': 'Manual Service Advisor Reassigned',
    'manual-reservation-receipt': 'Manual Reservation Receipt',
    'manual-service-invoice-upload': 'Manual Service Invoice Upload',
    'manual-repair-order-uploaded': 'Manual Repair Order Uploaded',
  },
  'email-notification-reminders': {
    'repair-order-invoice-is-ready': 'Repair Order Invoice Is Ready',
  },
};

export enum ModuleTitles {
  sales = 'Sales',
  'test-drive' = 'Test Drive',
  'trade-in' = 'Trade In',
  'bank-loan' = 'Bank Loan',
  'insurance-enquiry' = 'Insurance Enquiry',
  'service-packages' = 'Service Packages',
  'manual-reservation' = 'Manual Reservation',
  'email-notification-reminders' = 'Email Notification Reminders',
}

export enum ModuleSmsTitles {
  'manual-reservation' = 'Manual Reservation',
}

export const EventSmsTitle = {
  'manual-reservation': {
    'manual-reservation-service-appointment-confirmation':
      'Manual Reservation Service Appointment Confirmation',
    'manual-reservation-service-appointment-reminder':
      'Manual Reservation Service Appointment Reminder',
    'manual-booking-repair-order': 'Manual Booking Repair Order',
  },
};
