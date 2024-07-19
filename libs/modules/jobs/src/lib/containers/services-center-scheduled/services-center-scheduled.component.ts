import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// facade
import {
  ReservationsFacade,
  ServiceCenterScheduledFacade,
} from '../../+state/facade';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Dialog Component
import { IManualReservations } from '../../models';

import { ManualReservationFacade } from '../../+state';

// Dialog
import {
  CancelConfirmationDialogComponent,
  ResetConfirmationDialogComponent,
  CompleteConfirmationDialogComponent,
} from '../../components';
import { MatDialog } from '@angular/material/dialog';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { ICorporates } from '@neural/modules/customer/corporate';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'neural-services-center-scheduled',
  templateUrl: './services-center-scheduled.component.html',
  styleUrls: ['./services-center-scheduled.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesCenterScheduledComponent implements OnInit {
  title = 'scheduled';

  bc: IBC[];
  sort: ISort[];

  search = false;

  total: number;
  active: number[] = [];

  totals$: Observable<IReservations.ITotals>;

  reservationSlots: Observable<IReservations.IReservationSlots>;

  filters$: Observable<IReservations.IFilter>;

  statuses$: Observable<string[]>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  dayList$: Observable<{
    days: number;
    year: number;
    month: number;
  }>;

  reports$: Observable<{
    services: IReservations.IJob | null;
    jobs: IReservations.IJob | null;
    amendedInvoices: IReservations.IJob | null;
  }>;

  sorts: any[] = [];
  timeZone$: Observable<string>;
  openPanelState = false;
  selectedDate: string;
  filterInput = false;
  corporateInfo$: Observable<ICorporates.IDocument>;
  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private manualReservationFacade: ManualReservationFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog,
    private authFacade: AuthFacade,
    private reservationsFacade: ReservationsFacade
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
        name: 'scheduled',
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
    this.onRefresh(true);

    this.totals$ = this.serviceCenterScheduledFacade.totals$;

    this.serviceCenterScheduledFacade.getReservationSlots();

    this.reservationSlots = this.serviceCenterScheduledFacade.serviceCenterSlots$;
    
    this.reservationSlots.subscribe(res => console.log(res))

    this.filters$ = this.serviceCenterScheduledFacade.filters$;

    this.statuses$ = this.serviceCenterScheduledFacade.statuses$;

    this.loading$ = this.serviceCenterScheduledFacade.loading$;

    this.error$ = this.serviceCenterScheduledFacade.error$;

    this.dayList$ = this.serviceCenterScheduledFacade.dayList$;

    this.reports$ = this.serviceCenterScheduledFacade.reports$;

    this.corporateInfo$ = this.reservationsFacade.corporate$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.LIST_RESERVATION,
      permissionTags.Reservation.GET_RESERVATION,
      permissionTags.Reservation.RESET_RESERVATION,
      permissionTags.Reservation.ASSIGN_OPERATION_TEAM,
      permissionTags.Reservation.CANCEL_SERVICE_CENTER_RESERVATION,
      permissionTags.Reservation.COMPLETE_RESERVATION,
      permissionTags.Reservation.RESCHEDULE_SERVICE_CENTER_RESERVATION,

      permissionTags.ManualReservation.LIST_MANUAL_RESERVATIONS,
      permissionTags.ManualReservation.CREATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.DELETE_MANUAL_RESERVATION,
    ]);

    this.timeZone$ = this.authFacade.timeZone$;

    this.totals$.subscribe((data) => {
      this.total = data?.all;
    });
  }

  get rosterType() {
    return IReservations.RosterType;
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IReservations.IFilter = {
        ['calendar.slot']: moment().format('YYYY-MM-DD'),
        mobileService: 0,
        serviceType: 'SERVICE_CENTER',
      };

      this.serviceCenterScheduledFacade.setServiceCenterScheduledFilter(params);

      this.serviceCenterScheduledFacade.onResetDate();
    }
  }

  incrementDate(event: boolean) {
    if (event) {
      this.filterInput = false;
      this.serviceCenterScheduledFacade.onIncrement();
    }
  }

  decrement(event: boolean) {
    if (event) {
      this.filterInput = false;
      this.serviceCenterScheduledFacade.onDecrement();
    }
  }

  dateChange(date: string) {
    this.selectedDate = date;
    this.serviceCenterScheduledFacade.onChagedate(date);
  }

  serviceChange(event: any) {
    this.serviceCenterScheduledFacade.serviceReport();
  }

  jobsChange(event: any) {
    this.serviceCenterScheduledFacade.jobReport();
  }

  amendedInvoicesChange(event: any) {
    this.serviceCenterScheduledFacade.amendedReportReport();
  }

  cancel(reservation: IReservations.IDocument) {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.serviceCenterScheduledFacade.onCancel(reservation);
      }
    });
  }

  openCancelManualReservationDialog(
    reservation: IManualReservations.IDocument
  ) {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });
    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.manualReservationFacade.cancelManualReservation(reservation);
      }
    });
  }

  openCompleteDialog(reservation: IReservations.IDocument) {
    const dialogRef = this.dialog.open(CompleteConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.serviceCenterScheduledFacade.onComplete(reservation);
      }
    });
  }

  openCompleteManualReservationDialog(
    reservation: IManualReservations.IDocument
  ) {
    const dialogRef = this.dialog.open(CompleteConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.manualReservationFacade.completeManualReservation(reservation);
      }
    });
  }

  openResetManualReservationDialog(reservation: IManualReservations.IDocument) {
    const dialogRef = this.dialog.open(ResetConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.manualReservationFacade.resetManualReservation(reservation);
      }
    });
  }

  openResetDialog(reservation: IReservations.IDocument) {
    const dialogRef = this.dialog.open(ResetConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.serviceCenterScheduledFacade.onReset(reservation);
      }
    });
  }

  onCreate(reservaton: IManualReservations.ICreate) {
    this.manualReservationFacade.create(reservaton);
  }

  addNewReservation() {
    this.manualReservationFacade.addNewManualReservation();
  }

  onExpandAll(): void {
    this.openPanelState = !this.openPanelState;
  }

  onFilter(event: any) {
    this.filterInput = true;

    const params: IReservations.IFilter = {
      ['calendar.slot']: this.selectedDate
        ? this.selectedDate
        : moment().format('YYYY-MM-DD'),
      mobileService: 0,
      serviceType: 'SERVICE_CENTER',
      ['operation.uuid']: event ? event : {},
    };

    this.serviceCenterScheduledFacade.setServiceCenterScheduledFilter(params);
  }
}
