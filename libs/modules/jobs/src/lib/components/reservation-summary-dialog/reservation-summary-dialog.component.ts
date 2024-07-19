import {
  Component,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

//Dialog
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//Models
import { IManualReservations } from '../../models';

@Component({
  selector: 'neural-reservation-summary-dialog',
  templateUrl: './reservation-summary-dialog.component.html',
  styleUrls: ['./reservation-summary-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationSummaryDialogComponent {
  @Output() confirm = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<ReservationSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
    this.confirm.emit(false);
  }

  onConfirm(): void {
    this.confirm.emit(true);
    this.dialogRef.close();
  }

  handleDropWait(value: string) {
    switch (value) {
      case IManualReservations.Logistic.DROP_IN:
        return 'Drop';

      case IManualReservations.Logistic.WAIT:
        return 'Wait';
    }
  }
}
