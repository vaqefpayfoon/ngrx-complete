import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IInsurer } from '../../models';

@Component({
  selector: 'neural-insurer-confirmation-delete-dialog',
  templateUrl: './insurer-confirmation-delete-dialog.component.html',
  styleUrls: ['./insurer-confirmation-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurerConfirmationDeleteDialogComponent {
  @Output() deleted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<InsurerConfirmationDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInsurer.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.deleted.emit(false);
  }

  get name() {
    return this.data.name;
  }

  toggleDelete() {
    this.deleted.emit(true);
    this.dialogRef.close(true);
  }
}
