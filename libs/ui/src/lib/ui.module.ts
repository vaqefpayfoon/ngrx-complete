import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';

const MODULES: any[] = [
  MatButtonModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatRippleModule,
  MatToolbarModule,
  MatMenuModule,
  MatBadgeModule,
  MatDividerModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatCardModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonToggleModule,
  MatStepperModule,
  MatTooltipModule,
  MatDialogModule,
  MatListModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressBarModule,
  FlexLayoutModule,
  FormsModule,
  ReactiveFormsModule,
  MatPaginatorModule,
  MatExpansionModule,
  CommonModule,
  RouterModule,
  DragDropModule,
  ScrollingModule,
  MatTabsModule,
  ClipboardModule,
];

import * as publicDeclarations from './components';

// Services
import * as uiServices from './services';

@NgModule({
  imports: [...MODULES, HttpClientModule],
  exports: [...MODULES, ...publicDeclarations.COMPONENTS],
  declarations: [...publicDeclarations.COMPONENTS],
  providers: [...uiServices.services],
})
export class UiModule {
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.addIcon('notification_on', 'notification_on.svg');
    this.addIcon('notification', 'notification.svg');
    this.addIcon('dashboard_on', 'dashboard_on.svg');
    this.addIcon('dashboard', 'dashboard.svg');
    this.addIcon('arrow_down_on', 'arrow_down_on.svg');
    this.addIcon('arrow_down_off', 'arrow_down_off.svg');
    this.addIcon('arrow_up_on', 'arrow_up_on.svg');
    this.addIcon('arrow_up_off', 'arrow_up_off.svg');
    this.addIcon('Costumer_on', 'Costumer_on.svg');
    this.addIcon('Costumer_off', 'Costumer_off.svg');
    this.addIcon('Corporate_on', 'Corporate_on.svg');
    this.addIcon('Corporate_off', 'Corporate_off.svg');
    this.addIcon('administration_on', 'administration_on.svg');
    this.addIcon('administration_off', 'administration_off.svg');
    this.addIcon('firebase_on', 'firebase_on.svg');
    this.addIcon('firebase_off', 'firebase_off.svg');
    this.addIcon('technician_on', 'technician_on.svg');
    this.addIcon('technician_off', 'technician_off.svg');
    this.addIcon('booking_on', 'booking_on.svg');
    this.addIcon('booking_off', 'booking_off.svg');
    this.addIcon('location_on', 'location_on.svg');
    this.addIcon('location_off', 'location_off.svg');
    this.addIcon('preview_on', 'preview_on.svg');
    this.addIcon('preview_off', 'preview_off.svg');
    this.addIcon('edit_on', 'edit_on.svg');
    this.addIcon('bulk_inject', 'bulk_inject.svg');
    this.addIcon('edit_off', 'edit_off.svg');
    this.addIcon('delete_on', 'delete_on.svg');
    this.addIcon('delete_off', 'delete_off.svg');
    this.addIcon('arrow_right_on', 'arrow_right_on.svg');
    this.addIcon('arrow_right_off', 'arrow_right_off.svg');
    this.addIcon('arrow_left_on', 'arrow_left_on.svg');
    this.addIcon('arrow_left_off', 'arrow_left_off.svg');
    this.addIcon('action_on', 'action_on.svg');
    this.addIcon('action_off', 'action_off.svg');
    this.addIcon('back_button_on', 'back_button_on.svg');
    this.addIcon('back_button_off', 'back_button_off.svg');
    this.addIcon('close_on', 'close_on.svg');
    this.addIcon('close_off', 'close_off.svg');
    this.addIcon('search', 'search.svg');
    this.addIcon('refresh', 'refresh.svg');
    this.addIcon('check_box', 'check_box.svg');
    this.addIcon('currency', 'currency.svg');
    this.addIcon('state', 'state.svg');
    this.addIcon('add', 'add.svg');
    this.addIcon('tag', 'tag.svg');
    this.addIcon('access', 'access.svg');
    this.addIcon('general', 'general.svg');
    this.addIcon('security', 'security.svg');
    this.addIcon('logout', 'logout.svg');
    this.addIcon('labor', 'labor.svg');
    this.addIcon('product', 'product.svg');
    this.addIcon('product_new', 'product_new.svg');
    this.addIcon('like', 'like.svg');
    this.addIcon('dislike', 'dislike.svg');
    this.addIcon('cancel', 'cancel.svg');
    this.addIcon('fleetenroute', 'fleetenroute.svg');
    this.addIcon('inprogress', 'inprogress.svg');
    this.addIcon('notoperational', 'notoperational.svg');
    this.addIcon('pending', 'pending.svg');
    this.addIcon('onhold', 'onhold.svg');
    this.addIcon('completed', 'completed.svg');
  }

  private addIcon(name: string, url: string) {
    this.matIconRegistry.addSvgIcon(
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl(`https://d3gyzh3f9mj82k.cloudfront.net/icons/${url}`)
    );
  }
}
