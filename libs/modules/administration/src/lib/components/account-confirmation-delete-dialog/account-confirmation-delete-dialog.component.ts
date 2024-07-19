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
  selector: 'neural-account-confirmation-delete-dialog',
  templateUrl: './account-confirmation-delete-dialog.component.html',
  styleUrls: ['./account-confirmation-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfirmationDeleteDialogComponent {

  @Output() deleted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AccountConfirmationDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAccount.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.deleted.emit(false);
  }

  get name() {
    return this.data.identity
  }

  toggleDelete() {
    this.deleted.emit(true);
    this.dialogRef.close(true);
  }

}
