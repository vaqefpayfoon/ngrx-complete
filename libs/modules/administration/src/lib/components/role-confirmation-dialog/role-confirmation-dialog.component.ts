import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'neural-role-confirmation-dialog',
  templateUrl: './role-confirmation-dialog.component.html',
  styleUrls: ['./role-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleConfirmationDialogComponent {
  @Output()
  delete = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<RoleConfirmationDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  deleted() {
    this.delete.emit(true);
    this.dialogRef.close();
  }
}
