import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IApps } from '../../models';

@Component({
  selector: 'neural-corporate-app-confirmation-dialog',
  templateUrl: './corporate-app-confirmation-dialog.component.html',
  styleUrls: ['./corporate-app-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateAppConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CorporateAppConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IApps.IDocument
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
