import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IFleet } from '../../models';

@Component({
  selector: 'neural-fleet-confirmation-dialog',
  templateUrl: './fleet-confirmation-dialog.component.html',
  styleUrls: ['./fleet-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<FleetConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFleet.IDocument
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
