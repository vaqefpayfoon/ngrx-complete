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
  selector: 'neural-account-confirmation-resync-dialog',
  templateUrl: './account-confirmation-resync-dialog.component.html',
  styleUrls: ['./account-confirmation-resync-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfirmationResyncDialogComponent {
  @Output() resynced = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AccountConfirmationResyncDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAccount.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.resynced.emit(false);
  }

  get name() {
    return this.data.identity;
  }

  toggleResync() {
    this.resynced.emit(true);
    this.dialogRef.close(true);
  }
}
