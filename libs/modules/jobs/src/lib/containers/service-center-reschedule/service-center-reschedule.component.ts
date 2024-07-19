import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// facade
import {
  ServiceCenterScheduledFacade,
  ManualReservationFacade,
} from '../../+state/facade';

// Models
import { ICalendar, IManualReservations, IReservations } from '../../models';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

// RxJS
import { Observable } from 'rxjs';
@Component({
  selector: 'neural-service-center-reschedule',
  templateUrl: './service-center-reschedule.component.html',
  styleUrls: ['./service-center-reschedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCenterRescheduleComponent implements OnInit {
  data$: Observable<any>;

  branch$: Observable<Auth.IBranch>;

  calendar$: Observable<ICalendar.IDocument[]>;

  reservation$: Observable<IManualReservations.IDocument>;

  loading$: Observable<any>;

  bc: IBC[];

  timeZone$: Observable<string>;

  permission$: Observable<{}>;

  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private manualReservationFacade: ManualReservationFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'reservations',
        path: null,
      },
      {
        name: 'scheduled',
        path: '/app/hub/reservations/service-center/scheduled',
      },
      {
        name: 'rescheduled',
        path: null,
      },
    ];

    this.initialData();
  }

  initialData() {
    this.data$ = this.serviceCenterScheduledFacade.router$;

    this.branch$ = this.authFacade.selectedBranch;

    this.calendar$ = this.serviceCenterScheduledFacade.calendar$;

    // this.reservation$ = this.serviceCenterScheduledFacade.completedReservation$;
    this.reservation$ = this.manualReservationFacade.manualReservation$;
 
    this.loading$ = this.serviceCenterScheduledFacade.loading$;

    this.serviceCenterScheduledFacade.resetServiceCenterCalendar();

    this.timeZone$ = this.authFacade.timeZone$;

    this.permission$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.RESCHEDULE_SERVICE_CENTER_RESERVATION,
    ]);
  }

  create(payload: ICalendar.IGetCalendar) {
    this.serviceCenterScheduledFacade.getCalendar(payload);
  }

  onLoad(scheduled: IReservations.IDocument) {
    if (scheduled) {
      this.bc[this.bc.length - 1].name = scheduled.referenceNumber;
    }
  }

  onRescheduleServiceCenterReservation(event: IReservations.IReschedule) {
    this.serviceCenterScheduledFacade.rescheduleServiceCenterReservation(event);
  }
}
