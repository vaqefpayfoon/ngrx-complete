import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'neural-cdk-customer-dialog',
  templateUrl: './cdk-customer-dialog.component.html',
  styleUrls: ['./cdk-customer-dialog.component.scss']
})
export class CdkCustomerDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CdkCustomerDialogComponent>
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  OnConfirm(isExistingCustomer: boolean): void {
    this.dialogRef.close(isExistingCustomer);
  }
}
