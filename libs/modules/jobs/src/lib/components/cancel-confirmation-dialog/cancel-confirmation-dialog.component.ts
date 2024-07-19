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
  selector: 'neural-cancel-confirmation-dialog',
  templateUrl: './cancel-confirmation-dialog.component.html',
  styleUrls: ['./cancel-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>,
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
