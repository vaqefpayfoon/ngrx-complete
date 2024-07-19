import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//Store
import { EFFECTS, REDUCERS, facades } from './+state';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Inventory Components
import * as inventoryComponents from './components';

// Inventory Containers
import * as inventoryContainers from './containers';

//Guards
import * as fromGuards from './guards';

//Resolvers
import * as fromResolvers from './resolvers';

//Ui
import { UiModule } from '@neural/ui';
import { InventoryDetailComponent } from './components/inventory-detail/inventory-detail.component';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'inventory',
    pathMatch: 'full',
  },
  {
    path: '',
    component: inventoryContainers.InventoryItemComponent,
    data: { corporate: false, branch: true },
    resolve: [fromResolvers.InventoryResolver],
    canActivate: [fromGuards.InventoryGuard],
  },
];
@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('inventories', REDUCERS),
    EffectsModule.forFeature(EFFECTS),
  ],
  declarations: [
    ...inventoryContainers.COMPONENTS,
    ...inventoryComponents.COMPONENTS,
    InventoryDetailComponent,
  ],
  exports: [
    ...inventoryContainers.COMPONENTS,
    ...inventoryComponents.COMPONENTS,
  ],
  providers: [...facades, ...fromResolvers.resolvers],
})
export class InventoryModule {}
