import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
} from '@angular/core';

//Dialog
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

//rxjs
import { Observable } from 'rxjs';

//facade
import { ManualReservationFacade } from '../../+state';

//Models
import { IManualReservations, IReservations } from '../../models';

@Component({
  selector: 'neural-search-cdk-dialog',
  templateUrl: './search-cdk-dialog.component.html',
  styleUrls: ['./search-cdk-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCdkDialogComponent implements OnInit {
  @Output() searchVehicle = new EventEmitter<string>();

  @Output() vehicleInfo = new EventEmitter<IReservations.IAccountVehicle>();

  @Output() customerInfo = new EventEmitter<IManualReservations.IDMSCustomer>();

  @Output() reset = new EventEmitter<boolean>();

  selectedCustomerId: string;

  selectedVehicle: IReservations.IAccountVehicle;

  selectedCustomer: IManualReservations.IDMSCustomer;

  dmsVehiclesLoaded$: Observable<any>;

  dmsVehicles$: Observable<any>;

  dmsCustomers$: Observable<any>;

  dmsCustomersLoading$: Observable<any>;

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private manualReservationFacade: ManualReservationFacade,
    public dialogRef: MatDialogRef<SearchCdkDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.manualReservationFacade.getDMSCustomers({
      dms: {
        key: this.data?.key,
        name: this.data?.name,
        firstName: this.data?.firstName
      }
    });

    this.dmsCustomers$ = this.manualReservationFacade.dmsCustomers$;

    this.dmsVehicles$ = this.manualReservationFacade.dmsVehicles$;

    this.dmsCustomersLoading$ = this.manualReservationFacade.dmsCustomersloading$;
  }

  onSelectCustomer(customer: IManualReservations.IDMSCustomer) {
    if (customer) {
      this.selectedCustomerId = customer.id;
      this.selectedCustomer = customer;
    }
  }

  onSelectVehicle(vehicle: IReservations.IAccountVehicle) {
    if (vehicle) {
      this.selectedVehicle = vehicle;
    }
  }

  onSave() {
    this.vehicleInfo.emit(this.selectedVehicle);
    this.dialogRef.close();
    this.manualReservationFacade.resetDmsVehicles();
  }

  onBack(stepper: MatStepper) {
    this.manualReservationFacade.resetDmsVehiclesLoaded();
    this.manualReservationFacade.resetDmsVehicles();
    stepper.previous();
  }

  searchVehicleByCustomerId() {
    this.manualReservationFacade.getDMSVehicles(this.selectedCustomerId);
    this.customerInfo.emit(this.selectedCustomer);
    this.dmsVehiclesLoaded$ = this.manualReservationFacade.dmsVehiclesloaded$;

    this.dmsVehiclesLoaded$.subscribe((data: boolean) => {
      if (data) {
        this.stepper.next();
        this.reset.emit(true);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
    this.manualReservationFacade.resetDmsVehicles();
  }
}
