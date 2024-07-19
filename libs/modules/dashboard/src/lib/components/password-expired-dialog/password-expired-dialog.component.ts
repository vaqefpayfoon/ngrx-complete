import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neural-passwordExpired',
  templateUrl: './password-expired-dialog.component.html',
  styleUrls: ['./password-expired-dialog.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PasswordExpiredDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PasswordExpiredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  @Output() redirect = new EventEmitter();

  @Output() logout = new EventEmitter();

  ngOnInit(): void {}

  onRedirect() {
    this.redirect.emit(true);
    this.dialogRef.close();
  }

  onLogout() {
    this.logout.emit(true);
    this.dialogRef.close();
  }
}
