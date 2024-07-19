import { Component, OnInit } from '@angular/core';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// Facades
import {
  ManualReservationFacade,
  ReservationsFacade,
  ServiceLineFacade,
} from '../../+state';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { IBranches } from '@neural/modules/customer/corporate';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';
import { ICorporates } from '@neural/modules/customer/corporate';

import { ActivatedRoute } from '@angular/router';
import { IManualReservations } from '../../models';

@Component({
  selector: 'neural-new-manual-reservation',
  templateUrl: './new-manual-reservation.component.html',
  styleUrls: ['./new-manual-reservation.component.scss'],
})
export class NewManualReservationComponent implements OnInit {
  selectedBranch$: Observable<Auth.IBranch>;

  timeZone$: Observable<string>;

  operations$: Observable<Auth.IAccount[]>;

  permissions$: Observable<{}>;

  serviceLines$: Observable<any>;

  iso: string;

  serviceType: string;

  corporateUuid: string;

  selectedCorporate$: Observable<Auth.ICorporates>;

  corporateInfo$: Observable<ICorporates.IDocument>;

  loading$: Observable<any>;

  selectedServiceAdvisor: string | null;

  existingCustomer: any;

  branchInfo$: Observable<IBranches.IDocument>;

  makes$: Observable<IManualReservations.IVehicleMakes[]>;

  models$: Observable<IManualReservations.IVehicleModels[]>;

  yearMakes$: Observable<IManualReservations.IVehicleYearMakes[]>;

  bc: IBC[];

  title = 'Create a reservation';

  constructor(
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade,
    private reservationsFacade: ReservationsFacade,
    private manualReservationFacade: ManualReservationFacade,
    private serviceLineFacade: ServiceLineFacade,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'reservations',
        path: '/app/hub/reservations/service-center/scheduled',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.timeZone$ = this.authFacade.timeZone$;

    this.operations$ = this.manualReservationFacade.operations$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.selectedCorporate$.subscribe((data) => {
      this.corporateUuid = data.uuid;
    });

    this.corporateInfo$ = this.reservationsFacade.corporate$;

    this.serviceLines$ = this.serviceLineFacade.serviceLines$;

    this.branchInfo$ = this.serviceLineFacade.branch$;

    this.loading$ = this.serviceLineFacade.loading$;

    this.makes$ = this.manualReservationFacade.vehicleMakes$;
    
    this.corporateInfo$.subscribe(res => {
      this.route.params.subscribe((data) => {
        this.iso = data.iso;
        this.serviceType = data.type;
        this.existingCustomer = data.exist;
        this.selectedServiceAdvisor = data.sa;
      });
      if(res?.configuration?.cdk?.active) {
        this.manualReservationFacade.getVehicleMakes();
        if (this.existingCustomer == 'false') {
          this.title = 'Create A Reservation ( New Customer )';
        } else {
          this.title = 'Create A Reservation';
        }
      }
        
    })

    this.serviceLineFacade.getServiceLineList();
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ManualReservation.CREATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.LIST_VEHICLE_MAKES,
      permissionTags.ManualReservation.LIST_VEHICLE_MODELS,
      permissionTags.ManualReservation.LIST_VEHICLE_YEARS,
    ]);
  }

  onCreate(event) {
    this.manualReservationFacade.create(event);
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.manualReservationFacade.onRedirect();
      this.operations$ = this.manualReservationFacade.operations$;
    }
  }

  onRetrieveModel(makeId: string) {
    if (makeId) {
      this.models$ = this.manualReservationFacade.vehicleModels$;
      this.manualReservationFacade.getVehicleModels(makeId);
    }
  }

  onRetrieveYearMakes(event) {
    if (event) {
      this.yearMakes$ = this.manualReservationFacade.vehicleYearMakes$;
      this.manualReservationFacade.getVehicleYearMakes(event.makeId, event.modelId);
    }
  }
}
