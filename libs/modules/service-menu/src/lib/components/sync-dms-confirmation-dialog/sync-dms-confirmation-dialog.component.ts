import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neural-sync-dms-confirmation-dialog',
  templateUrl: './sync-dms-confirmation-dialog.component.html',
  styleUrls: ['./sync-dms-confirmation-dialog.component.scss'],
})
export class SyncDmsConfirmationDialogComponent implements OnInit {
  @Output() sync = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<SyncDmsConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  onConfirmSync() {
    this.sync.emit(true);
  }
}
