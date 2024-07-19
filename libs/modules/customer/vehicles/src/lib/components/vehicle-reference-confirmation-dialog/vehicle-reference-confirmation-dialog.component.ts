import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IVehicleReference } from '../../models';

@Component({
  selector: 'neural-vehicle-reference-confirmation-dialog',
  templateUrl: './vehicle-reference-confirmation-dialog.component.html',
  styleUrls: ['./vehicle-reference-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleReferenceConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<VehicleReferenceConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVehicleReference.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return `${this.data.unit.brand} ${this.data.unit.model}`;
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }
}
