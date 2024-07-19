import { IDocument } from './account.interface';

export type ISADocument = Pick<
  IDocument,
  'identity' | 'uuid' | 'email' | 'phone'
>;
