import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neural-customized-description-dialog',
  templateUrl: './customized-description-dialog.component.html',
  styleUrls: ['./customized-description-dialog.component.scss']
})
export class CustomizedDescriptionDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CustomizedDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.data.description);
  }
}
