import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IVehicle } from '../../models';

@Component({
  selector: 'neural-vehicle-confirmation-dialog',
  templateUrl: './vehicle-confirmation-dialog.component.html',
  styleUrls: ['./vehicle-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<VehicleConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVehicle.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return `${this.data.numberPlate}`;
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }

}
