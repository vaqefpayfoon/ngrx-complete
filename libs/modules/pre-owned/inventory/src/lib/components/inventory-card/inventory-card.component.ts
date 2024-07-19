import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


//Models
import { IInventory } from '../../models';
import { InventoryDetailComponent } from '../inventory-detail/inventory-detail.component';

@Component({
  selector: 'neural-inventory-card',
  templateUrl: './inventory-card.component.html',
  styleUrls: ['./inventory-card.component.scss'],
})
export class InventoryCardComponent implements OnInit {
  @Input() inventory: IInventory.IInventory;
  @Input() permissions: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onDownload(inventory: IInventory.IInventory) {
    const url = inventory.downloadPath;

    window.open(url, '_blank');
  }
  onShowDetails(event: IInventory.IInventory) {
    this.dialog.open(InventoryDetailComponent, {
      height: '600px',
      width: '800px',
      data: event,
      disableClose: true
    });
  }
}
