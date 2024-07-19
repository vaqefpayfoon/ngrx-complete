import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IAccount } from '../../models';

@Component({
  selector: 'neural-firebase-confirmation-resync-dialog',
  templateUrl: './firebase-confirmation-resync-dialog.component.html',
  styleUrls: ['./firebase-confirmation-resync-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirebaseConfirmationResyncDialogComponent {
  @Output() firebaseResynced = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<FirebaseConfirmationResyncDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAccount.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.firebaseResynced.emit(false);
  }

  get name() {
    return this.data.identity;
  }

  toggleFirebaseResync() {
    this.firebaseResynced.emit(true);
    this.dialogRef.close(true);
  }
}
