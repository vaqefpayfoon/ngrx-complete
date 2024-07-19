import { Component, OnInit } from '@angular/core';

//Rxjs
import { Observable } from 'rxjs';

//Models
import { IInventory } from '../../models';
import { InventoryService } from '../../services';

//facade
import { InventoryFacade } from '../../+state/facades';

@Component({
  selector: 'neural-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss'],
})
export class InventoriesComponent implements OnInit {
  inventories$: Observable<IInventory.IInventory[]>;
  permissions$: Observable<any>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  total$: Observable<number>;


  constructor(
    private inventoryService: InventoryService,
    private inventoryFacade: InventoryFacade
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    
    this.loading$ = this.inventoryFacade.loading$;

    this.error$ = this.inventoryFacade.error$;

    this.total$=this.inventoryFacade.total$

    this.inventories$ = this.inventoryFacade.inventories$;
  }
}
