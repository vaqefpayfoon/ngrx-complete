export enum BankLoanStatus {
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  IN_PROCESS = 'IN_PROCESS',
}

export enum BankLoanDocumentsTitle {
  REGISTRATION_CARD = 'REGISTRATION_CARD',
  INCOME_PROOF = 'INCOME_PROOF',
  IDENTIFICATION_DOCUMENT = 'IDENTIFICATION_DOCUMENT',
  ADDITIONAL_DOCUMENT = 'ADDITIONAL_DOCUMENT',
  ADDITIONAL_DOCUMENT_ONE = 'ADDITIONAL_DOCUMENT_ONE',
  ADDITIONAL_DOCUMENT_TWO = 'ADDITIONAL_DOCUMENT_TWO',
  APPROVAL_DOCUMENT = 'APPROVAL_DOCUMENT',
}

export enum BankLoanDocumentsMime {
  IMAGE = 'image',
  IMAGE_PNG = 'image/png',
  IMAGE_JPG = 'image/jpg',
  TEXT = 'plain/text',
  HTML = 'text/html',
  PDF = 'application/pdf',
  EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export enum BankLoanDocumentsCustomerDecision {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum BankLoanTitle {
  IDENTIFICATION_DOCUMENT = 'IDENTIFICATION_DOCUMENT',
}

export interface IBank {
  uuid: string;
  interestRate: number;
  name?: string;
}

export interface ILoan {
  amount: number;
  downPayment: number;
  monthlyInstallment: number;
  lastInstalment?: number;
  period: number;
  interestRate?: number;
}

export interface IBankAccount {
  uuid: string;
  identification: string;
  nationality: string;
  dateOfBirth: string;
}

export interface IBankLoanDocuments {
  title: BankLoanDocumentsTitle;
  url: string;
}

export interface IBankCorporate {
  uuid: string;
  name: string;
}

export interface ICreate {
  bank: IBank;
  loan: ILoan;
  account: IBankAccount;
  documents: IBankLoanDocuments[];
  saleUuid?: string;
  corporateUuid: string;
}

type CreateName = 'account' | 'saleUuid' | 'corporateUuid';

export type CreateLoans = Pick<ICreate, CreateName> &
  Record<'loans', ISelfBankLoans[]>;

export interface IDocument extends ICreate {
  uuid: string;
  status: BankLoanStatus;
  corporate: IBankCorporate;
  customerDecision: BankLoanDocumentsCustomerDecision;
  applicant: string;
  active: boolean;
}

export interface ISelfLoan {
  amount: number;
  downPayment: number;
  interestRate: number;
  monthlyInstallment: number;
  period: number;
}

export interface ISelfBankLoans {
  bankUuid: string;
  loan: ISelfLoan;
}

export interface IUpdateBankLoan {
  uuid: string;
  saleUuid?: string;
  customerDecision?: string;
  documents?: IBankLoanDocuments;
  status?: string;
  loan?: ILoan;
  bank?: IBank;
}

export interface IDeleteBankLoan {
  uuid: string;
}
