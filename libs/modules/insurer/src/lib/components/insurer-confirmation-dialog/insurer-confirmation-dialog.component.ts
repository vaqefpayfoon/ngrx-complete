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
  selector: 'neural-insurer-confirmation-dialog',
  templateUrl: './insurer-confirmation-dialog.component.html',
  styleUrls: ['./insurer-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurerConfirmationDialogComponent {
  @Output() status = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<InsurerConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInsurer.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return this.data.name;
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }
}
