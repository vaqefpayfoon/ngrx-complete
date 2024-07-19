import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IManualReservations, IServiceLine } from '../../models';

//models corporate
import { ICorporates, IBranches } from '@neural/modules/customer/corporate';

import { ICalendars } from '@neural/modules/calendar';

// Facades
import { CalendarsFacade } from '@neural/modules/calendar';
import {
  ManualReservationFacade,
  ReservationsFacade,
  ServiceLineFacade,
} from '../../+state';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'neural-manual-reservation-item',
  templateUrl: './manual-reservation-item.component.html',
  styleUrls: ['./manual-reservation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualReservationItemComponent implements OnInit {
  reservation$: Observable<IManualReservations.IDocument>;

  error$: Observable<any>;

  loading$: Observable<any>;

  serviceLineloading$: Observable<any>;

  bc: IBC[];

  selectedBranch$: Observable<Auth.IBranch>;

  timeZone$: Observable<string>;

  operations$: Observable<Auth.IAccount[]>;

  filters$: Observable<ICalendars.IGetCalendar>;

  selectedSlot$: Observable<ICalendars.ISlot>;

  serviceLines$: Observable<any>;

  permissions$: Observable<{}>;

  corporateUuid: string;

  selectedCorporate$: Observable<Auth.ICorporates>;

  corporateInfo$: Observable<ICorporates.IDocument>;

  branchInfo$: Observable<IBranches.IDocument>;

  customTag = '';

  constructor(
    private manualReservationFacade: ManualReservationFacade,
    private reservationsFacade: ReservationsFacade,
    private calendarsFacade: CalendarsFacade,
    private permissionValidatorService: PermissionValidatorService,
    private serviceLineFacade: ServiceLineFacade,
    private authFacade: AuthFacade,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    this.route.params.subscribe(param => {
      if (param?.tag) {
        this.customTag = param.tag;
      }
    })
    this.reservation$ = this.manualReservationFacade.manualReservation$;

    this.error$ = this.manualReservationFacade.error$;

    this.loading$ = this.manualReservationFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.selectedCorporate$.subscribe((data) => {
      this.corporateUuid = data.uuid;
    });

    this.getCorporate();

    this.corporateInfo$ = this.reservationsFacade.corporate$;

    this.timeZone$ = this.authFacade.timeZone$;

    this.operations$ = this.manualReservationFacade.operations$;

    this.filters$ = this.calendarsFacade.calendarsFilter$;

    this.selectedSlot$ = this.manualReservationFacade.selectedSlot$;

    this.serviceLines$ = this.serviceLineFacade.serviceLines$;

    this.branchInfo$ = this.serviceLineFacade.branch$;

    this.serviceLineloading$ = this.serviceLineFacade.loading$;

    this.manualReservationFacade.loadAlloperations();

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ManualReservation.CREATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.UPDATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.GET_MANUAL_RESERVATION,
      permissionTags.ManualReservation.LIST_VEHICLE_MAKES,
      permissionTags.ManualReservation.LIST_VEHICLE_MODELS,
      permissionTags.ManualReservation.LIST_VEHICLE_YEARS,
    ]);

    this.onSearchServiceLine('');
  }

  onLoad(reservaton: IManualReservations.IDocument) {
    if (reservaton) {
      this.bc[this.bc.length - 1].name = reservaton.referenceNumber;
    }
  }

  onUpdateBcTime(timeSlot: any) {
    if (timeSlot) {
      this.bc[this.bc.length - 3].name = timeSlot;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.manualReservationFacade.onRedirect();
      this.manualReservationFacade.loadAlloperations();
    }
  }

  onCreate(reservaton: IManualReservations.ICreate) {
    this.manualReservationFacade.create(reservaton);
  }

  onUpdate(reservaton: IManualReservations.IDocument) {
    this.manualReservationFacade.update(reservaton);
  }

  getCorporate() {
    this.reservationsFacade.getCorporate(this.corporateUuid);
    this.manualReservationFacade.loadAlloperations();
  }

  onSearchServiceLine(event: any) {
    let serviceType: string;
    this.reservation$.subscribe((data) => {
      return (serviceType = data?.calendar?.serviceTypes[0]);
    });

    const filter: IServiceLine.IFilter = {
      ['service.title']: event,
      ['service.type']: serviceType,
    };
    this.serviceLineFacade.changeServiceLineFilter(filter);
    this.serviceLines$ = this.serviceLineFacade.serviceLines$;
  }
}
