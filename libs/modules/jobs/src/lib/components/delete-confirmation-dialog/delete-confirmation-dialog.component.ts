import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IReservations } from '../../models';

@Component({
  selector: 'neural-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmationDialogComponent {
  @Output() deleted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IReservations.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.deleted.emit(false);
  }

  get name() {
    return this.data.referenceNumber;
  }

  toggleStatus() {
    this.deleted.emit(true);
    this.dialogRef.close(true);
  }
}
