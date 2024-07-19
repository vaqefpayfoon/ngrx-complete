import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IServices } from '../../models';

@Component({
  selector: 'neural-service-confirmation-dialog',
  templateUrl: './service-confirmation-dialog.component.html',
  styleUrls: ['./service-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ServiceConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IServices.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return `${this.data.title}`;
  }

  get isActive() {
    return this.data.isActive;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }
}
