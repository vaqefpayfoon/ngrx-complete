export enum HTML_UPLOAD_FOLDERS {
  INBOX = 'inbox',
  CAMPAIGN = 'campaign',
}

export interface IUploadImage {
  corporateUuid: string;
  folder: HTML_UPLOAD_FOLDERS;
  file: any;
}
