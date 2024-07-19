import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IReservations } from '../../models';

@Component({
  selector: 'neural-reset-confirmation-dialog',
  templateUrl: './reset-confirmation-dialog.component.html',
  styleUrls: ['./reset-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ResetConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReservations.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return this.data.referenceNumber;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }

}
