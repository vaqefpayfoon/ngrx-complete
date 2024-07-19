import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInventory } from '../../models';

@Component({
  selector: 'neural-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<InventoryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInventory.IInventory
  ) {}
  displayedColumns: string[] = ['stockNo', 'status', 'errors'];
  close(): void {
    this.dialogRef.close();
  }
}
