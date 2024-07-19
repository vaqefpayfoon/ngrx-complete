import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// facade
import {
  CompletedFacade,
  ServiceCenterScheduledFacade,
} from '../../+state/facade';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import {
  CancelConfirmationDialogComponent,
  ResetConfirmationDialogComponent,
  CompleteConfirmationDialogComponent,
} from '../../components';

// Models
import { IManualReservations } from '../../models';

// Facades
import { ManualReservationFacade } from '../../+state';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'neural-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletedComponent implements OnInit {
  title = 'scheduled';

  bc: IBC[];
  sort: ISort[];

  search = false;

  completedReservations$: Observable<IReservations.MyReservations[]>;

  filters$: Observable<IReservations.IFilter>;

  statuses$: Observable<string[]>;

  total$: Observable<number>;

  total: number;

  totals$: Observable<IReservations.ITotals>;

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

  constructor(
    private completedFacade: CompletedFacade,
    private manualReservationFacade: ManualReservationFacade,
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private dialog: MatDialog,
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
        name: 'reservations',
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

    this.completedReservations$ = this.completedFacade.completedReservations$;

    this.total$ = this.completedFacade.total$;

    this.loading$ = this.completedFacade.loading$;
    
    this.error$ = this.completedFacade.error$;

    this.dayList$ = this.completedFacade.dayList$;

    this.reports$ = this.completedFacade.reports$;

    this.filters$ = this.completedFacade.filters$;

    this.statuses$ = this.completedFacade.statuses$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.LIST_RESERVATION,
      permissionTags.Reservation.GET_RESERVATION,
      permissionTags.Reservation.RESET_RESERVATION,
      permissionTags.Reservation.ASSIGN_OPERATION_TEAM,
      permissionTags.Reservation.CANCEL_MOBILE_RESERVATION,
      permissionTags.Reservation.RESCHEDULE_MOBILE_RESERVATION,
      permissionTags.Reservation.COMPLETE_RESERVATION,

      permissionTags.ManualReservation.LIST_MANUAL_RESERVATIONS,
      permissionTags.ManualReservation.CREATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.DELETE_MANUAL_RESERVATION,
    ]);

    this.completedFacade.resetMobileServiceCalendar();

    this.timeZone$ = this.authFacade.timeZone$;
  }

  get rosterType() {
    return IReservations.RosterType;
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IReservations.IFilter = {
        ['calendar.slot']: moment().format('YYYY-M-DD'),
        mobileService: 1,
        serviceType: 'MOBILE_SERVICE',
      };

      this.completedFacade.setMobileServiceScheduledFilter(params);

      this.completedFacade.onResetDate();
    }
  }

  cancel(reservation: IReservations.IDocument) {
    const dialogRef = this.dialog.open(CancelConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.completedFacade.onCancel(reservation);
      }
    });
  }

  complete(reservation: IReservations.IDocument) {
    const dialogRef = this.dialog.open(CompleteConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.completedFacade.onComplete(reservation);
      }
    });
  }

  reset(reservation: IReservations.IDocument) {
    const dialogRef = this.dialog.open(ResetConfirmationDialogComponent, {
      data: reservation,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        this.completedFacade.onReset(reservation);
      }
    });
  }

  incrementDate(event: boolean) {
    if (event) {
      this.completedFacade.onIncrement();
    }
  }

  decrement(event: boolean) {
    if (event) {
      this.completedFacade.onDecrement();
    }
  }

  dateChange(date: string) {
    this.completedFacade.onChagedate(date);
  }

  serviceChange(event: any) {
    this.completedFacade.serviceReport();
  }

  jobsChange(event: any) {
    this.completedFacade.jobReport();
  }

  amendedInvoicesChange(event: any) {
    this.completedFacade.amendedReportReport();
  }

  openDeleteDialog(event: IManualReservations.IDocument) {
    // const dialogRef = this.dialog.open(
    //   ManualReservationConfirmationDeleteDialogComponent,
    //   {
    //     data: event,
    //     disableClose: true,
    //   }
    // );
    // dialogRef.componentInstance.deleted.subscribe((res: boolean) => {
    //   if (res) {
    //     return this.manualReservationFacade.deleteMobileReservation(event);
    //   }
    // });
  }
}
