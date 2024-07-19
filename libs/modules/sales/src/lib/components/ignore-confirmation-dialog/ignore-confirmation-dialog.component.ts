import {
  Component,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { ISales } from '../../models';

@Component({
  selector: 'neural-ignore-confirmation-dialog',
  templateUrl: './ignore-confirmation-dialog.component.html',
  styleUrls: ['./ignore-confirmation-dialog.component.scss']
})
export class IgnoreConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<IgnoreConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISales.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return this.data?.referenceNumber ?? 'DBP5LL5';
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }

}
