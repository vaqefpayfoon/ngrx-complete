import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IAccount } from '../../models';

@Component({
  selector: 'neural-account-qrcode-dialog',
  templateUrl: './account-qrcode-dialog.component.html',
  styleUrls: ['./account-qrcode-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountQrcodeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AccountQrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAccount.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  get name() {
    return `${this.data?.identity?.salutation ?? ''} ${this.data?.identity?.fullName}`;
  }

  get qrcode() {
    return this.data.qrCode;
  }
}
