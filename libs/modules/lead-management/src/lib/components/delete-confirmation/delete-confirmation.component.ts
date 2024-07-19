import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'neural-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  toggleDelete() {
    this.dialogRef.close(true);
  }

}
