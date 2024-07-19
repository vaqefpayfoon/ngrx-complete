import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// facade
import { ServiceCenterDeclinedFacade } from '../../+state/facade';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-services-center-declined',
  templateUrl: './services-center-declined.component.html',
  styleUrls: ['./services-center-declined.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesCenterDeclinedComponent implements OnInit {
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
    private serviceCenterDeclinedFacade: ServiceCenterDeclinedFacade,
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
        path: null,
      },
      {
        name: 'service center',
        path: null,
      },
      {
        name: 'declined',
        path: null,
      },
    ];

    this.sort = [
      {
        Name: 1,
      },
      {
        Type: 1,
      },
      {
        'Registeration Number': 1,
      },
      {
        Status: 1,
      },
    ];

    this.reservations$ = this.serviceCenterDeclinedFacade.reservations$;
 
    this.total$ = this.serviceCenterDeclinedFacade.total$;
    this.reservationsConfig$ = this.serviceCenterDeclinedFacade.reservationsConfig$;

    this.loading$ = this.serviceCenterDeclinedFacade.loading$;
    this.error$ = this.serviceCenterDeclinedFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.LIST_RESERVATION,
      permissionTags.Reservation.GET_RESERVATION,
    ]);

    this.timeZone$ = this.authFacade.timeZone$;
  }

  onRefresh(event: boolean, filter?: any) {
    const E = IReservations.Status;
    const keys = Object.keys(E).filter(
      (k) => typeof E[k as any] === 'string' && E[k as any] === 'JOB_CANCELED'
    );
    const statusFilter = keys.map((k) => E[k as any]);
    if (event) {
      const params: IReservations.IConfig = {
        limit: IReservations.Config.LIMIT,
        mobileService: 0,
        serviceType:'SERVICE_CENTER',
        page: 1,
        statusFilter,
      };
      this.serviceCenterDeclinedFacade.setResevationPage(params);
    }
  }

  changePage(event: PageEvent, statusFilters: string) {
    const statusFilter = statusFilters.toString().split(',');

    const params: IReservations.IConfig = {
      limit: IReservations.Config.LIMIT,
      mobileService: 0,
      serviceType:'SERVICE_CENTER',
      page: event.pageIndex + 1,
      statusFilter,
    };
    this.serviceCenterDeclinedFacade.setResevationPage(params);
  }

  unSelectFilter(statusFilter: string[], dateFilter: string) {
    const params: IReservations.IConfig = {
      limit: IReservations.Config.LIMIT,
      page: 1,
      mobileService: 0,
      serviceType:'SERVICE_CENTER',
      statusFilter,
      dateFilter,
    };
    this.serviceCenterDeclinedFacade.setResevationPage(params);
  }
}
