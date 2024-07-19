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
  selector: 'neural-account-confirmation-dialog',
  templateUrl: './account-confirmation-dialog.component.html',
  styleUrls: ['./account-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AccountConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAccount.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return this.data.identity
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }
}
