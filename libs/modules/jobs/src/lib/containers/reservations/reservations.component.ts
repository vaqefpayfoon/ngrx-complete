import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  ISort, IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// facade
import { ReservationsFacade } from '../../+state/facade';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationsComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;

  reservations$: Observable<IReservations.IDocument[]>;
  total$: Observable<number>;
  reservationsConfig$: Observable<IReservations.IConfig>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  sorts: any[] = [];

  timeZone$: Observable<string>;

  constructor(
    private reservationsFacade: ReservationsFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
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
        name: 'declined',
        path: null
      }
    ];

    this.sort = [
      {
        Name: 1
      },
      {
        Type: 1
      },
      {
        'Registeration Number': 1
      },
      {
        Status: 1
      }
    ];

    this.reservations$ = this.reservationsFacade.reservations$;

    this.total$ = this.reservationsFacade.total$;
    this.reservationsConfig$ = this.reservationsFacade.reservationsConfig$;

    this.loading$ = this.reservationsFacade.loading$;
    this.error$ = this.reservationsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.LIST_RESERVATION,
      permissionTags.Reservation.GET_RESERVATION
    ]);

    this.timeZone$ = this.authFacade.timeZone$;
  }

  onRefresh(event: boolean, filter?: any) {
    const E = IReservations.Status;
    const keys = Object.keys(E).filter(
      k =>
        typeof E[k as any] === 'string' &&
        (E[k as any] === 'BOOKING_ON_HOLD' ||
          E[k as any] === 'JOB_CANCELED' ||
          E[k as any] === 'NOT_OPERATIONAL')
    );
    const statusFilter = keys.map(k => E[k as any]);
    if (event) {
      const params: IReservations.IConfig = {
        limit: IReservations.Config.LIMIT,
        page: 1,
        mobileService: 1,
        statusFilter
      };
      this.reservationsFacade.setResevationPage(params);
    }
  }

  changePage(event: PageEvent, statusFilters: string) {
    const statusFilter = statusFilters.toString().split(',');

    const params: IReservations.IConfig = {
      limit: IReservations.Config.LIMIT,
      page: event.pageIndex + 1,
      mobileService: 1,
      statusFilter
    };
    this.reservationsFacade.setResevationPage(params);
  }

  unSelectFilter(statusFilter: string[], dateFilter: string) {
    const params: IReservations.IConfig = {
      limit: IReservations.Config.LIMIT,
      page: 1,
      mobileService: 1,
      statusFilter,
      dateFilter
    };
    this.reservationsFacade.setResevationPage(params);
  }
}
