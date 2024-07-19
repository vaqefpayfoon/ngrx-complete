import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'neural-group-confirmation-dialog',
  templateUrl: './group-confirmation-dialog.component.html',
  styleUrls: ['./group-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupConfirmationDialogComponent {
  @Output()
  delete = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<GroupConfirmationDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  deleted() {
    this.delete.emit(true);
    this.dialogRef.close();
  }
}
