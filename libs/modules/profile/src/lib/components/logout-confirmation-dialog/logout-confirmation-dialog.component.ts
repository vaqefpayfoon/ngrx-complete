import { Component, Inject, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neural-logout-confirmation-dialog',
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrls: ['./logout-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @Output()
  exit = new EventEmitter();

  logout() {
    this.exit.emit(true);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
