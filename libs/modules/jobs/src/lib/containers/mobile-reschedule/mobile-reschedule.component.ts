import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// facade
import { CompletedFacade } from '../../+state/facade';

// Models
import { ICalendar, IReservations } from '../../models';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJS
import { Observable } from 'rxjs';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-mobile-reschedule',
  templateUrl: './mobile-reschedule.component.html',
  styleUrls: ['./mobile-reschedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileRescheduleComponent implements OnInit {
  branch$: Observable<Auth.IBranch>;

  calendar$: Observable<ICalendar.IDocument[]>;

  reservation$: Observable<IReservations.IDocument>;

  loading$: Observable<any>;

  permission$: Observable<{}>;

  data$: Observable<any>;

  timezone$: Observable<string>;

  bc: IBC[];

  constructor(
    private completedFacade: CompletedFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'reservations',
        path: null
      },
      {
        name: 'scheduled',
        path: '/app/hub/reservations/mobile/scheduled'
      },
      {
        name: 'rescheduled',
        path: null
      }
    ];

    this.initialData();
  }

  initialData() {
    this.branch$ = this.authFacade.selectedBranch;

    this.calendar$ = this.completedFacade.calendar$;

    this.reservation$ = this.completedFacade.completedReservation$;

    this.loading$ = this.completedFacade.loading$;

    this.data$ = this.completedFacade.router$;

    this.timezone$ = this.authFacade.timeZone$;

    this.permission$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.RESCHEDULE_MOBILE_RESERVATION
    ]);
  }

  create(payload: ICalendar.IGetCalendar) {
    this.completedFacade.getCalendar(payload);
  }

  onLoad(scheduled: IReservations.IDocument) {
    if (scheduled) {
      this.bc[this.bc.length - 1].name = scheduled.referenceNumber;
    }
  }

  onRescheduleMobileReservation(event: IReservations.IReschedule) {
    this.completedFacade.rescheduleMobileReservation(event);
  }
}
