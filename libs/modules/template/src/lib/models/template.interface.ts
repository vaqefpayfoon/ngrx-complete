export const CampaignTags = {
  general: [
    { key: 'Magic Link', value: '{{dynamicLink}}' },
    { key: 'Error message', value: '{{error.message}}' },
  ],
  account: [
    { key: 'User Name', value: '{{account.identity.fullName}}' },
    { key: 'User Salutation', value: '{{account.identity.salutation}}' },
    { key: 'User Email', value: '{{account.email}}' },
    { key: 'User Phone Code', value: '{{account.phone.code}}' },
    { key: 'User Phone Number', value: '{{account.phone.number}}' },
    { key: 'User Image', value: '{{account.image}}' },
    { key: 'User QR Code', value: '{{account.qrCode}}' },
    { key: 'User Password', value: '{{account.password}}' },
    {
      key: 'Quotation Shared Auto generated Password',
      value: '{{receiverAccount.password}}',
    },
    {
      key: 'Quotation Shared Auto generated Username',
      value: '{{receiverAccount.username}}',
    },
    {
      key: 'Quotation Share Sender Name',
      value: '{{senderAccount.identity.fullName}}',
    },
    {
      key: 'Quotation Share Sender Salutation',
      value: '{{senderAccount.identity.salutation}}',
    },
    { key: 'Quotation Share Sender Email', value: '{{senderAccount.email}}' },
    {
      key: 'Quotation Share Sender Phone Code',
      value: '{{senderAccount.phone.code}}',
    },
    {
      key: 'Quotation Sharer Phone Number',
      value: '{{senderAccount.phone.number}}',
    },
    {
      key: 'Service Advisor',
      value: '{{serviceAdvisor.identity.fullName}}',
    },
    { key: 'Corporate Name', value: '{{corporate.name}}' },
  ],
  accountVehicle: [
    { key: 'Customer Name', value: '{{account.name}}' },
    { key: 'Customer Email', value: '{{account.email}}' },
    { key: 'Customer Phone Code', value: '{{account.phone.code}}' },
    { key: 'Customer Phone Number', value: '{{account.phone.number}}' },
    { key: 'Unit Brand', value: '{{unit.brand}}' },
    { key: 'Unit Model', value: '{{unit.model}}' },
    { key: 'Unit Variant', value: '{{unit.variant}}' },
    { key: 'Unit Display', value: '{{unit.display}}' },
    {
      key: 'Vehicle Registration Number',
      value: '{{accountVehicle.numberPlate}}',
    },
    { key: 'Document ID', value: '{{documentId}}' },
    { key: 'Document Type', value: '{{documentType}}' },
    { key: 'Remarks', value: '{{remarks}}' },
    {
      key: 'Document Number',
      value: '{{accountVehicle.identificationNumber}}',
    },
    { key: 'Mileage', value: '{{mileage}}' },
    { key: 'Source of Valuation', value: '{{source}}' },
  ],
  rsvpReservation: [
    { key: 'Number of Pax', value: '{{rsvpReservation.pax}}' },
    { key: 'Date Selected', value: '{{rsvpReservation.date}}' },
    { key: 'Campaign Name', value: '{{rsvpReservation.name}}' },
  ],
  enquiry: [
    { key: 'Subject', value: '{{subject}}' },
    { key: 'Details', value: '{{details}}' },
    { key: 'division', value: '{{division}}' },
    { key: 'Name', value: '{{account.name}}' },
    { key: 'Email', value: '{{account.email}}' },
    { key: 'Phone', value: '{{account.phone.number}}' },
  ],
  lead: [
    {
      key: 'Email Address',
      value: '{{receiverAccount.email}}',
    },
    {
      key: 'Password',
      value: '{{receiverAccount.password}}',
    },
  ],
  sale: [
    { key: 'Remark', value: '{{sale.remark}}' },
    { key: 'Branch Name', value: '{{sale.branch.name}}' },
    { key: 'Payload Amount', value: '{{sale.payment.payableAmount}}' },
    { key: 'Unit Brand', value: '{{sale.model.unit.brand}}' },
    { key: 'Unit Model', value: '{{sale.model.unit.model}}' },
    { key: 'Unit Variant', value: '{{sale.model.unit.variant}}' },
    { key: 'Unit Display', value: '{{sale.model.unit.display}}' },
    { key: 'Reference Number', value: '{{sale.referenceNumber}}' },
    {
      key: 'Sale Advisor Name',
      value: '{{sale.saleAdvisor.identity.fullName}}',
    },
    { key: 'Sale Advisor Email', value: '{{sale.saleAdvisor.identity.email}}' },
    {
      key: 'Sale Advisor Phone Number',
      value: '{{sale.saleAdvisor.phone.number}}',
    },
    {
      key: 'Sale Advisor Phone Code',
      value: '{{sale.saleAdvisor.phone.code}}',
    },
    {
      key: 'Customer Name',
      value: '{{sale.account.identity.fullName}}',
    },
    { key: 'Customer Email', value: '{{sale.account.email}}' },
    {
      key: 'Customer Phone Number',
      value: '{{sale.account.phone.number}}',
    },
    {
      key: 'Customer Phone Code',
      value: '{{sale.account.phone.code}}',
    },
    {
      key: 'Exterior Color',
      value: '{{sale.model.exterior.color.name}}',
    },
    {
      key: 'Interior Color',
      value: '{{sale.model.interior.color.name}}',
    },
    {
      key: 'Registeration Number',
      value: '{{sale.numberPlate}}',
    },
    {
      key: 'Estimated Total Price',
      value: '{{sale.model.price}}',
    },
    {
      key: 'Booking Fee Payment Method',
      value: '{{sale.payment.method}}',
    },
    {
      key: 'Booking Fee Paid Amount',
      value: '{{sale.payment.payableAmount}}',
    },
    {
      key: 'Booking Fee Payment Date & Time',
      value: '{{sale.payment.dateAndTime}}',
    },
    {
      key: 'Downpayment Payment Date & Time',
      value: '{{sale.downpayment.payment.dateAndTime}}',
    },
    {
      key: 'Loan Applied Bank Name(s)',
      value: '{{{sale.bankNames}}}',
    },
    {
      key: 'Signed Document URL',
      value: '{{sale.document.signature.url}}',
    },
    {
      key: 'Retail Customer Order Signed Document URL',
      value: '{{sale.rco.signature.url}}',
    },
    {
      key: 'Final Vehicle Price',
      value: '{{sale.rco.finalValue}}',
    },
    {
      key: 'Final Trade-In Value',
      value: '{{sale.downPayment.breakDown.finalTradeInValue}}',
    },
    {
      key: 'Approve Loan Amount',
      value: '{{sale.downPayment.breakDown.approvedLoan}}',
    },
    {
      key: 'Insurance & Road Tax Amount',
      value: '{{sale.downPayment.breakDown.insuranceAndRoadTax}}',
    },
    {
      key: 'Other Fees Amount',
      value: '{{sale.downPayment.breakDown.otherFees}}',
    },
    {
      key: 'Balance Down Payment',
      value: '{{sale.downPayment.breakDown.balanceDownpaymentDue}}',
    },
    {
      key: 'Amount Paid',
      value: '{{sale.downPayment.payment.amount}}',
    },
    {
      key: 'Receipt No.',
      value: '{{sale.downPayment.payment.receiptNumber}}',
    },
    {
      key: 'Location Type',
      value: '{{sale.calendar.collectionType}}',
    },
    {
      key: 'Location Address',
      value: '{{sale.calendar.location.address}}',
    },
    {
      key: 'Preferred Date & Time',
      value: '{{sale.calendar.date}}',
    },
    {
      key: 'Collection/Delivery Remark',
      value: '{{sale.calendar.remark}}',
    },
    {
      key: 'UUID',
      value: '{{sale.uuid}}',
    },
    {
      key: 'Email',
      value: '{{sale.account.email}}',
    },
    {
      key: 'Corporate Name',
      value: '{{sale.corporate.name}}',
    },
    {
      key: 'Booking Fee TransactionID',
      value: '{{sale.payment.payload.id}}',
    },
    {
      key: 'Downpayment TransactionID',
      value: '{{sale.downPayment.payment.payload.id}}',
    },
    {
      key: 'Function',
      value: '{{sale.message}}',
    },
    {
      key: 'Downpayment Paid Amount',
      value: '{{sale.downPayment.payment.payment}}',
    },
  ],
  testDrive: [
    { key: 'Vehicle Brand', value: '{{testDrive.payload.unit.brand}}' },
    { key: 'Vehicle Model', value: '{{testDrive.payload.unit.model}}' },
    { key: 'Vehicle Variant', value: '{{testDrive.payload.unit.variant}}' },
    { key: 'Branch Name', value: '{{testDrive.branch.name}}' },
    { key: 'Branch Email', value: '{{testDrive.branch.email}}' },
    { key: 'Remark', value: '{{testDrive.payload.remark}}' },
    {
      key: 'Appointment Selected Dates',
      value: '{{{testDrive.selectedSlots}}}',
    },
    {
      key: 'Appointment Confirmed Date',
      value: '{{testDrive.payload.actualDateAndTime}}',
    },
    { key: 'Location Address', value: '{{testDrive.location.address}}' },
    { key: 'Location Type', value: '{{testDrive.type}}' },
    {
      key: 'Sales Advisor Name',
      value: '{{testDrive.payload.salesAdvisor.name}}',
    },
    {
      key: 'Sales Advisor Email',
      value: '{{testDrive.payload.salesAdvisor.email}}',
    },
    {
      key: 'Sales Advisor Phone Number',
      value: '{{testDrive.payload.salesAdvisor.phone.phoneNumber}}',
    },
    {
      key: 'Sales Advisor Phone Code',
      value: '{{testDrive.payload.salesAdvisor.phone.code}}',
    },
    {
      key: 'Reference Number',
      value: '{{testDrive.referenceNumber}}',
    },
    {
      key: 'Customer Name',
      value: '{{testDrive.account.identity.fullName}}',
    },
    {
      key: 'Customer Phone Number',
      value: '{{testDrive.account.phone.number}}',
    },
    {
      key: 'Customer Phone Code',
      value: '{{testDrive.account.phone.code}}',
    },
    {
      key: 'Customer Email',
      value: '{{testDrive.account.email}}',
    },
  ],
  alternateDriver: [
    { key: 'Owner Name', value: '{{owner.identity.fullName}}' },
    { key: 'Alt Driver Name', value: '{{driver.identity.fullName}}' },
    { key: 'Alt Driver Email', value: '{{driver.email}}' },
    { key: 'Alt Driver Password', value: '{{driver.password}}' },
    { key: 'Alt Driver Relationship', value: '{{driver.relationship}}' },
    {
      key: 'Owner Vehicle Brand',
      value: '{{owner.vehicle.vehicleReference.unit.brand}}',
    },
    {
      key: 'Owner Vehicle Model',
      value: '{{owner.vehicle.vehicleReference.unit.display}}',
    },
    {
      key: 'Owner Vehicle Number Plate',
      value: '{{owner.vehicle.numberPlate}}',
    },
  ],
  manualReservation: [
    {
      key: 'Reference Number',
      value: '{{manualReservation.referenceNumber}}',
    },
    {
      key: 'Account Name',
      value: '{{manualReservation.account.fullName}}',
    },
    {
      key: 'Account Email',
      value: '{{manualReservation.account.email}}',
    },
    {
      key: 'Account Phone',
      value: '{{manualReservation.account.phone.number}}',
    },
    {
      key: 'creation time',
      value: '{{manualReservation.moment.createdAt}}',
    },
    {
      key: 'Vehicle NumberPlate',
      value: '{{manualReservation.accountVehicle.numberPlate}}',
    },
    {
      key: 'Vehicle Model',
      value: '{{manualReservation.accountVehicle.model}}',
    },
    {
      key: 'Branch name',
      value: '{{manualReservation.branch.name}}',
    },
    {
      key: 'Branch Email',
      value: '{{manualReservation.branch.email}}',
    },
    {
      key: 'Corporate name',
      value: '{{manualReservation.corporate.name}}',
    },
    {
      key: 'Calendar',
      value: '{{manualReservation.moment.calendar}}',
    },
    {
      key: 'Location Address',
      value: '{{manualReservation.location.address}}',
    },
    {
      key: 'Branch Location Address',
      value: '{{manualReservation.branch.location.address}}',
    },
    {
      key: 'Service Advisor',
      value: '{{manualReservation.operation.identity.fullName}}',
    },
    {
      key: 'Service Advisor Phone Number',
      value: '{{manualReservation.operation.phone.number}}',
    },
    {
      key: 'Service Advisor Phone Code',
      value: '{{manualReservation.operation.phone.code}}',
    },
    {
      key: 'Repair Order Number',
      value: '{{manualReservation.repairOrder.number}}',
    },
    {
      key: 'Service Inovice Number',
      value: '{{manualReservation.invoice.number}}',
    },
    {
      key: 'Year Make',
      value: '{{manualReservation.accountVehicle.year}}',
    },
    {
      key: 'Total Payable Amount',
      value: '{{manualReservation.invoice.payment.payableAmount}}',
    },
    {
      key: 'Invoice Document',
      value: '{{manualReservation.invoice.docUrl}}',
    },
    {
      key: 'Service Types',
      value: '{{manualReservation.calendar.serviceTypes}}',
    },
    {
      key: 'Logistic Method',
      value: '{{manualReservation.calendar.logistic}}',
    },
    {
      key: 'Customer ID',
      value: '{{manualReservation.integration.cdk.customerId}}',
    },
    {
      key: 'Vehicle ID',
      value: '{{manualReservation.integration.cdk.vehicleId}}',
    },
    {
      key: 'Mileage',
      value: '{{manualReservation.accountVehicle.mileage}}',
    },
    {
      key: 'Remark',
      value: '{{manualReservation.remark}}',
    },
    {
      key: 'Upcoming engine oil service',
      value:
        '{{manualReservation.accountVehicle.nextService.upcomingEngineOilService}}',
    },
    {
      key: 'Estimated engine oil service',
      value:
        '{{manualReservation.accountVehicle.nextService.estimatedEngineOilService}}',
    },
    {
      key: 'Payment Gateway',
      value: '{{manualReservation.payment.url}}',
    },
  ],
  reservation: [
    {
      key: 'Reservation Reference Number',
      value: '{{reservation.referenceNumber}}',
    },
    {
      key: 'Reservation Creation Time',
      value: '{{reservation.moment.createdAt}}',
    },
    {
      key: 'Reservation Calendar',
      value: '{{reservation.moment.calendar}}',
    },
    {
      key: 'Services',
      value: '{{reservation.services}}',
    },
    {
      key: 'Selected Types',
      value: '{{reservation.calendar.selectedTypes}}',
    },
    {
      key: 'Products',
      value: '{{reservation.products}}',
    },
    {
      key: 'Branch Name',
      value: '{{reservation.branch.name}}',
    },
    {
      key: 'Branch Email',
      value: '{{reservation.branch.email}}',
    },
    {
      key: 'Location Address',
      value: '{{reservation.location.address}}',
    },
    {
      key: 'Vehicle Number Plate',
      value: '{{reservation.accountVehicle.numberPlate}}',
    },
    {
      key: 'Vehicle Brand',
      value: '{{reservation.accountVehicle.vehicleReference.unit.brand}}',
    },
    {
      key: 'Vehicle Model',
      value: '{{reservation.accountVehicle.vehicleReference.unit.display}}',
    },
    {
      key: 'Vehicle Variant',
      value:
        '{{reservation.accountVehicle.vehicleReference.unit.variant.display}}',
    },
    {
      key: 'Payment Payable Amount',
      value: '{{reservation.summary.payableAmount}}',
    },
    {
      key: 'Payment Summary Subtotal',
      value: '{{reservation.summary.subtotal}}',
    },
    {
      key: 'Payment Summary Labour',
      value: '{{reservation.summary.labour}}',
    },
    {
      key: 'Payment Summary Tax',
      value: '{{reservation.summary.tax}}',
    },
    {
      key: 'Payment Summary Total',
      value: '{{reservation.summary.total}}',
    },
  ],
  BankLoan: [
    {
      key: 'Accepted Bank Name',
      value: '{{bankLoan.bank.name}}',
    },
    {
      key: "Loan Customer's Decision",
      value: '{{bankLoan.customerDecision}}',
    },
    {
      key: 'Interest Rate',
      value: '{{bankLoan.bank.interestRate}}',
    },
    {
      key: 'Loan Years',
      value: '{{bankLoan.loan.period}}',
    },
  ],
  tradeIn: [
    {
      key: 'brand',
      value: '{{tradeIn.unit.brand}}',
    },
    {
      key: 'model',
      value: '{{tradeIn.unit.model}}',
    },
    {
      key: 'Registration Number',
      value: '{{tradeIn.numberPlate}}',
    },
    {
      key: 'Trade In Inspection Location',
      value: '{{sale.branch.name}}',
    },
    {
      key: 'Trade In Inspection Date & Time',
      value: '{{tradeIn.inspection.request.date}}',
    },
    {
      key: 'Trade In Inspection Remark',
      value: '{{tradeIn.inspection.request.remark}}',
    },
    {
      key: 'Valuation Amount',
      value: '{{tradeIn.offer.approximateValue}}',
    },
    {
      key: 'Valuation Expiry Date',
      value: '{{tradeIn.offer.validity}}',
    },
    {
      key: "Valuation Customer's Decision",
      value: '{{tradeIn.offer.customerDecision}}',
    },
    {
      key: 'Inspection Valuation Amount',
      value: '{{tradeIn.inspection.offer.finalValue}}',
    },
    {
      key: 'Inspection Valuation Expiry Date',
      value: '{{tradeIn.inspection.offer.validity}}',
    },
    {
      key: "Inspection Valuation Customer's Decision",
      value: '{{tradeIn.inspection.offer.customerDecision}}',
    },
  ],
  Branch: [
    {
      key: 'Branch Name',
      value: '{{branch.name}}',
    },
    {
      key: 'Branch Location',
      name: '{{branch.location.address}}',
    },
  ],
  insuranceEnquiry: [
    { key: 'Reference Number', value: '{{insuranceEnquiry.referenceNumber}}' },
    {
      key: 'Customer Name',
      value: '{{insuranceEnquiry.account.name}}',
    },
    {
      key: 'Customer Phone',
      value: '{{insuranceEnquiry.account.phone}}',
    },
    {
      key: 'Customer Email',
      value: '{{insuranceEnquiry.account.email}}',
    },
    { key: 'Registration Number', value: '{{insuranceEnquiry.numberPlate}}' },
    { key: 'NCD Entitlement', value: '{{insuranceEnquiry.ncdEntitlement}}' },
    { key: 'Document ID', value: '{{insuranceEnquiry.document.type}}' },
    { key: 'Document Number', value: '{{insuranceEnquiry.document.id}}' },
    { key: 'Post Code', value: '{{insuranceEnquiry.postCode}}' },
    { key: 'Remarks', value: '{{insuranceEnquiry.remark}}' },
    {
      key: 'Unit Brand',
      value: '{{insuranceEnquiry.accountVehicle.vehicleReference.unit.brand}}',
    },
    {
      key: 'Unit Model',
      value:
        '{{insuranceEnquiry.accountVehicle.vehicleReference.unit.model.actual}}',
    },
    {
      key: 'Unit Variant',
      value:
        '{{insuranceEnquiry.accountVehicle.vehicleReference.unit.variant.actual}}',
    },
    {
      key: 'Unit Display',
      value:
        '{{insuranceEnquiry.accountVehicle.vehicleReference.unit.display}}',
    },
    {
      key: 'Selected Insurance Name',
      value: '{{insuranceEnquiry.insurerName}}',
    },
  ],
  repairOrder: [
    {
      key: 'Account Name',
      value: '{{repairOrder.account.name}}',
    },
    {
      key: 'Repair Order Number',
      value: '{{repairOrder.id}}',
    },
    {
      key: 'Creation Date ',
      value: '{{repairOrder.createdAt.date}}',
    },
    {
      key: 'Creation Time',
      value: '{{repairOrder.createdAt.time}}',
    },
    {
      key: 'Completion Date',
      value: '{{repairOrder.promisedDate.date}}',
    },
    {
      key: 'Completion Time',
      value: '{{repairOrder.promisedDate.time}}',
    },
    {
      key: 'Branch Name',
      value: '{{repairOrder.branch.name}}',
    },
    {
      key: 'Branch Location',
      value: '{{repairOrder.branch.location}}',
    },
    {
      key: 'Service Advisor',
      value: '{{repairOrder.operation.identity.fullName}}',
    },
    {
      key: 'Service Advisor Code',
      value: '{{repairOrder.operation.phone.code}}',
    },
    {
      key: 'Service Advisor Phone',
      value: '{{repairOrder.operation.phone.number}}',
    },
    {
      key: 'Model',
      value: '{{repairOrder.vehicle.model}}',
    },
    {
      key: 'Brand',
      value: '{{repairOrder.vehicle.brand}}',
    },
    {
      key: 'mileage',
      value: '{{repairOrder.vehicle.mileage}}',
    },
    {
      key: 'License / Reg',
      value: '{{repairOrder.vehicle.numberPlate}}',
    },
{
      key: 'Vehicle Identification Number',
      value: '{{repairOrder.vehicle.vin}}',
    },
    {
      key: 'ServiceLines',
      value: '{{repairOrder.serviceLines}}',
    },
    {
      key: 'ServiceLine Name',
      value: '{{name}}',
    },
    {
      key: 'Operation Code',
      value: '{{operationCode}}',
    },
    {
      key: 'Description',
      value: '{{description}}',
    },
    {
      key: 'Approval Link',
      value: '{{repairOrder.approvalLink}}',
    },
    {
      key: 'Rejection Link',
      value: '{{repairOrder.rejectionLink}}',
    },
  ],
  digitalInvoice: [
    {
      key: 'Account Name',
      value: '{{digitalInvoice.account.name}}',
    },
    {
      key: 'Repair Order Number',
      value: '{{digitalInvoice.id}}',
    },
    {
      key: 'Branch Name',
      value: '{{digitalInvoice.branch.name}}',
    },
    {
      key: 'Branch Location',
      value: '{{digitalInvoice.branch.location}}',
    },
    {
      key: 'Service Advisor',
      value: '{{digitalInvoice.operation.identity.fullName}}',
    },
    {
      key: 'Service Advisor Phone Code',
      value: '{{digitalInvoice.operation.phone.code}}',
    },
    {
      key: 'Service Advisor Phone Number',
      value: '{{digitalInvoice.operation.phone.number}}',
    },
    {
      key: 'Make/Model',
      value: '{{digitalInvoice.vehicle.model}}',
    },
    {
      key: 'mileage',
      value: '{{digitalInvoice.vehicle.mileage}}',
    },
    {
      key: 'License / Reg',
      value: '{{digitalInvoice.vehicle.numberPlate}}',
    },
    {
      key: 'VIN Number',
      value: '{{digitalInvoice.vehicle.identificationNumber}}',
    },
    {
      key: 'Digital Invoice Url',
      value: '{{digitalInvoice.payment.url}}',
    },
    {
      key: 'Customer Id',
      value: '{{digitalInvoice.customerId}}',
    },
    {
      key: 'Repair Order Number',
      value: '{{digitalInvoice.repairOrderNumber}}',
    },
    {
      key: 'Customer Name',
      value: '{{digitalInvoice.customerName}}',
    },
    {
      key: 'Grand Total',
      value: '{{digitalInvoice.grandTotal}}',
    },
    {
      key: 'Discount',
      value: '{{digitalInvoice.discount}}',
    },
    {
      key: 'Tag Number',
      value: '{{digitalInvoice.tagNumber}}',
    },
    {
      key: 'Comments',
      value: '{{digitalInvoice.comments}}',
    },
    {
      key: 'Remarks',
      value: '{{digitalInvoice.remarks}}',
    },
    {
      key: 'Invoice Date',
      value: '{{digitalInvoice.date}}',
    },
    {
      key: 'Sub Total',
      value: '{{digitalInvoice.subTotal}}',
    },
    {
      key: 'Tax',
      value: '{{digitalInvoice.tax}}',
    },
    {
      key: 'Brand',
      value: '{{digitalInvoice.vehicle.brand}}',
    },
    {
      key: 'Currency',
      value: '{{currency}}',
    },
  ],
  corporate: [
    {
      key: 'Customer Service Phone Number',
      value: '{{corporate.peopleInCharge.customerService.phone}}',
    },
  ],
};
export enum Types {
  HTML = 'HTML',
  EDITOR = 'Editor'
}

export enum Labels {
  EmailNotification = 'EmailNotification',
  InboxMessage = 'InboxMessage',
  Campaign = 'Campaign'
}

export enum TemplateCreationType {
  NORMAL = 'NORMAL',
  MASTER = 'MASTER',
  FROM_MASTER = 'FROM_MASTER'
}

export interface IData {
  docs: IDocument[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export enum Config {
  LIMIT = 10
}

export interface IPagination {
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface IConfig {
  page: number;
  limit: number;
}

export interface IFilter {
  [key: string]: any;
}

export interface ITag {
  key: string;
  value: string;
}

export interface ICreateMaster {
  name: string;
  subject: string;
  html: string;
  tags?: ITag[];
  labels?: string[];
}

export interface ICreate {
  name: string;
  corporateUUid: string;
  subject: string;
  html: any;
  tags?: ITag[];
  labels?: string[];
}

export interface IDocument extends ICreate {
  uuid: string;
  isMaster: boolean;
  active: boolean;
}

export interface ICreateFromMaster {
  uuid: string;
  corporateUUid: string;
  html: string;
  subject?: string;
  labels?: string[];
}

export interface IUpdate {
  uuid: string;
  name?: string;
  subject?: string;
  html?: string;
}

export const {...email } = CampaignTags;

export const {
  ['reservation']: reservation,
  ['general']: general,
  ...tag
} = CampaignTags;
