import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IServiceLine } from '../../models';

@Component({
  selector: 'neural-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IServiceLine.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }
  toggleStatus() {

    this.dialogRef.close(true);
  }

}
