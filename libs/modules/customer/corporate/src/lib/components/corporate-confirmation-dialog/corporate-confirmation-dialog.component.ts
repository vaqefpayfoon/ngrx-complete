import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { ICorporates } from '../../models';

@Component({
  selector: 'neural-corporate-confirmation-dialog',
  templateUrl: './corporate-confirmation-dialog.component.html',
  styleUrls: ['./corporate-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CorporateConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICorporates.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return `${this.data.name}`;
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }

}
