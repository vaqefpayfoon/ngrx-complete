import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IManualReservations } from '../../models';
import { CdkCustomerDialogComponent } from '../cdk-customer-dialog/cdk-customer-dialog.component';

@Component({
  selector: 'neural-create-manual-reservation',
  templateUrl: './create-manual-reservation.component.html',
  styleUrls: ['./create-manual-reservation.component.scss'],
})
export class CreateManualReservationComponent {
  @Input() element: IManualReservations.IAvailableSlot;

  @Input() selectedServiceAdvisor: string;
  @Input() active: boolean;

  constructor(private router: Router,
    private dialog: MatDialog) {}

  onCreate(): void {
    if (this.active) {
      this.dialog.open(CdkCustomerDialogComponent, {
        width: '400px',
        height: '220px',
        closeOnNavigation: false,
      }).afterClosed().subscribe((exist) => {
        this.router.navigate([
          '/app/hub/reservations/service-center/new',
          this.element?.iso,
          this.element?.type,
          exist,
          this.selectedServiceAdvisor ? this.selectedServiceAdvisor : '',
        ]);
      });
    } else {
      const exist = false;
      this.router.navigate([
        '/app/hub/reservations/service-center/new',
        this.element?.iso,
        this.element?.type,
        exist,
        this.selectedServiceAdvisor ? this.selectedServiceAdvisor : '',
      ]);
    }
  }
}
